import { send } from './send.js';
import { findPeer } from './peers.js';

export function handleChat(room, ws, msg) {
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
}
