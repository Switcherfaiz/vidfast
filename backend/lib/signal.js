import { WebSocketServer } from 'ws';
import {
  getRoom,
  addPeer,
  removePeer,
  peerList,
  findPeer,
  findSocket,
  publicRoom,
  setRoomPassword,
  verifyRoomPassword
} from './rooms.js';

function send(ws, payload) {
  if (ws?.readyState === 1) ws.send(JSON.stringify(payload));
}

function broadcast(room, payload, exceptWs = null) {
  for (const ws of room.peers.keys()) {
    if (ws !== exceptWs) send(ws, payload);
  }
}

export function attachSignal(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    ws._alive = true;
    ws.on('pong', () => { ws._alive = true; });

    ws.on('message', async (raw) => {
      let msg = null;
      try { msg = JSON.parse(String(raw)); } catch (_) { return; }
      if (!msg?.type) return;

      if (msg.type === 'join') {
        try {
          await onJoin(ws, msg);
        } catch (error) {
          console.error('[vf:signal] join failed', { room: msg.room, message: error?.message });
          send(ws, { type: 'error', error: 'Could not join this meeting.' });
        }
        return;
      }
      const left = [...(getActive(ws)?.peers?.keys?.() ? [] : [])];
      void left;
      const room = ws._room;
      if (!room) return;

      if (msg.type === 'signal' && msg.to) {
        const target = findSocket(room, msg.to);
        if (target) send(target, { type: 'signal', from: ws._peerId, data: msg.data || {} });
        else console.warn('[vf:signal] relay target missing', { room: room.code, from: ws._peerId, to: msg.to });
        return;
      }

      if (msg.type === 'chat') {
        const peer = findPeer(room, ws._peerId);
        const payload = {
          type: 'chat',
          message: {
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            fromId: ws._peerId,
            authorName: peer?.name || 'Guest',
            avatar: peer?.avatar || '',
            text: String(msg.text || '').slice(0, 2000),
            at: Date.now()
          }
        };
        for (const client of room.peers.keys()) send(client, payload);
        return;
      }

      if (msg.type === 'profile') {
        const peer = findPeer(room, ws._peerId);
        if (!peer) return;
        if (msg.name) peer.name = String(msg.name).slice(0, 40);
        if (msg.avatar) peer.avatar = String(msg.avatar);
        if (typeof msg.muted === 'boolean') peer.muted = msg.muted;
        if (typeof msg.cameraOn === 'boolean') peer.cameraOn = msg.cameraOn;
        if (msg.backdrop) peer.backdrop = String(msg.backdrop).slice(0, 20);
        broadcast(room, {
          type: 'peer-update',
          peer: {
            id: peer.id,
            name: peer.name,
            avatar: peer.avatar,
            muted: peer.muted,
            cameraOn: peer.cameraOn,
            backdrop: peer.backdrop || 'none'
          }
        });
        return;
      }

      if (msg.type === 'set-password') {
        if (room.hostId !== ws._peerId) return;
        try {
          await setRoomPassword(room, msg.password);
          broadcast(room, { type: 'room', room: publicRoom(room) });
        } catch (error) {
          console.error('[vf:signal] password update failed', { room: room.code, message: error?.message });
          send(ws, { type: 'error', error: 'Could not update room password.' });
        }
        return;
      }

      if (msg.type === 'kick' && msg.peerId) {
        if (room.hostId !== ws._peerId) return;
        const target = findSocket(room, msg.peerId);
        if (!target) return;
        send(target, { type: 'kicked' });
        target.close();
      }
    });

    ws.on('close', () => {
      const result = removePeer(ws);
      if (!result?.peer || result.empty) return;
      broadcast(result.room, { type: 'peer-leave', peerId: result.peer.id, hostId: result.room.hostId });
      syncRoomPeers(result.room);
    });
  });

  const beat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws._alive) return ws.terminate();
      ws._alive = false;
      ws.ping();
    });
  }, 25000);
  wss.on('close', () => clearInterval(beat));
}

function getActive(ws) {
  return ws._room || null;
}

async function onJoin(ws, msg) {
  const room = await getRoom(msg.room);
  if (!room) {
    send(ws, { type: 'error', error: 'Room is gone. Create a new meeting.' });
    return;
  }
  if (!await verifyRoomPassword(room, msg.password)) {
    send(ws, { type: 'need-password' });
    return;
  }

  const peer = {
    id: String(msg.peer?.id || ''),
    name: String(msg.peer?.name || 'Guest').slice(0, 40),
    avatar: String(msg.peer?.avatar || ''),
    muted: !!msg.peer?.muted,
    cameraOn: msg.peer?.cameraOn !== false,
    backdrop: String(msg.peer?.backdrop || 'none').slice(0, 20)
  };
  if (!peer.id) {
    send(ws, { type: 'error', error: 'Missing guest id' });
    return;
  }

  addPeer(room, ws, peer);
  ws._room = room;
  ws._peerId = peer.id;

  send(ws, {
    type: 'joined',
    room: publicRoom(room),
    you: peer,
    peers: peerList(room, peer.id)
  });
  broadcast(room, { type: 'peer-join', peer, hostId: room.hostId }, ws);
  syncRoomPeers(room);
}

function syncRoomPeers(room) {
  for (const client of room.peers.keys()) {
    send(client, {
      type: 'room-peers',
      hostId: room.hostId,
      peers: peerList(room, client._peerId)
    });
  }
}
