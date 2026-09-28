import { broadcast } from './send.js';
import { findPeer } from './peers.js';

export function handleProfile(room, ws, msg) {
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
}
