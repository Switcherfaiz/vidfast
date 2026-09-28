import { send } from './send.js';
import { findSocket } from './peers.js';

export function handleKick(room, ws, msg) {
  if (room.hostId !== ws._peerId || !msg.peerId) return;
  const target = findSocket(room, msg.peerId);
  if (!target) return;
  send(target, { type: 'kicked' });
  target.close();
}
