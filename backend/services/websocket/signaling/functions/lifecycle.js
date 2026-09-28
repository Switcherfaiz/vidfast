import { broadcast } from './send.js';
import { removePeer } from './peers.js';
import { syncRoomPeers } from './join.js';

export function handleDisconnect(ws) {
  const result = removePeer(ws);
  if (!result?.peer || result.empty) return;
  broadcast(result.room, {
    type: 'peer-leave',
    peerId: result.peer.id,
    hostId: result.room.hostId
  });
  syncRoomPeers(result.room);
}

export function startHeartbeat(wss) {
  const beat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws._alive) return ws.terminate();
      ws._alive = false;
      ws.ping();
    });
  }, 25000);
  wss.on('close', () => clearInterval(beat));
  return beat;
}

export function parseMessage(raw) {
  try {
    const msg = JSON.parse(String(raw));
    return msg?.type ? msg : null;
  } catch (_) {
    return null;
  }
}
