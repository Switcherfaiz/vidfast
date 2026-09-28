import { send, broadcast } from './send.js';
import { getRoom, publicRoom, verifyRoomPassword } from './rooms.js';
import { addPeer, peerList } from './peers.js';

export function syncRoomPeers(room) {
  for (const client of room.peers.keys()) {
    send(client, {
      type: 'room-peers',
      hostId: room.hostId,
      peers: peerList(room, client._peerId)
    });
  }
}

export async function onJoin(ws, msg) {
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
