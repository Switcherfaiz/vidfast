import { rooms } from './rooms.js';

export function addPeer(room, ws, peer) {
  room.peers.set(ws, peer);
  if (!room.hostId) room.hostId = peer.id;
  return peer;
}

export function removePeer(ws) {
  for (const [code, room] of rooms) {
    if (!room.peers.has(ws)) continue;
    const peer = room.peers.get(ws);
    room.peers.delete(ws);
    if (room.hostId === peer.id) {
      const next = [...room.peers.values()][0];
      room.hostId = next?.id || '';
    }
    if (room.peers.size === 0) rooms.delete(code);
    return { room, peer, empty: room.peers.size === 0 };
  }
  return null;
}

export function peerList(room, exceptId = '') {
  return [...room.peers.values()]
    .filter((peer) => peer.id !== exceptId)
    .map((peer) => ({
      id: peer.id,
      name: peer.name,
      avatar: peer.avatar,
      muted: !!peer.muted,
      cameraOn: peer.cameraOn !== false,
      backdrop: peer.backdrop || 'none'
    }));
}

export function findPeer(room, id) {
  for (const peer of room.peers.values()) {
    if (peer.id === id) return peer;
  }
  return null;
}

export function findSocket(room, id) {
  for (const [ws, peer] of room.peers) {
    if (peer.id === id) return ws;
  }
  return null;
}

export function getActive(ws) {
  return ws._room || null;
}
