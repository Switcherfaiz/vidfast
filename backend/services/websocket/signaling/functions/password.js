import { send, broadcast } from './send.js';
import { publicRoom, setRoomPassword } from './rooms.js';

export async function handleSetPassword(room, ws, msg) {
  if (room.hostId !== ws._peerId) return;
  try {
    await setRoomPassword(room, msg.password);
    broadcast(room, { type: 'room', room: publicRoom(room) });
  } catch (error) {
    console.error('[vf:signal] password update failed', { room: room.code, message: error?.message });
    send(ws, { type: 'error', error: 'Could not update room password.' });
  }
}
