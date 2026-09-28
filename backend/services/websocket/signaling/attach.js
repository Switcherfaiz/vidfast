import { WebSocketServer } from 'ws';
import * as signaling from './functions/index.js';

export function attachSignal(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    ws._alive = true;
    ws.on('pong', () => { ws._alive = true; });

    ws.on('message', async (raw) => {
      const msg = signaling.parseMessage(raw);
      if (!msg) return;

      if (msg.type === 'join') {
        try {
          await signaling.onJoin(ws, msg);
        } catch (error) {
          console.error('[vf:signal] join failed', { room: msg.room, message: error?.message });
          signaling.send(ws, { type: 'error', error: 'Could not join this meeting.' });
        }
        return;
      }

      const room = signaling.getActive(ws);
      if (!room) return;

      if (msg.type === 'signal') return signaling.relayPeerSignal(room, ws, msg);
      if (msg.type === 'chat') return signaling.handleChat(room, ws, msg);
      if (msg.type === 'profile') return signaling.handleProfile(room, ws, msg);
      if (msg.type === 'set-password') return signaling.handleSetPassword(room, ws, msg);
      if (msg.type === 'kick') return signaling.handleKick(room, ws, msg);
    });

    ws.on('close', () => signaling.handleDisconnect(ws));
  });

  signaling.startHeartbeat(wss);
  return wss;
}
