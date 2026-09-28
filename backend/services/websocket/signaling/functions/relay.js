import { send } from './send.js';
import { findSocket } from './peers.js';

export function relayPeerSignal(room, ws, msg) {
  if (!msg.to) return;
  const target = findSocket(room, msg.to);
  if (target) {
    send(target, { type: 'signal', from: ws._peerId, data: msg.data || {} });
    return;
  }
  console.warn('[vf:signal] relay target missing', {
    room: room.code,
    from: ws._peerId,
    to: msg.to
  });
}
