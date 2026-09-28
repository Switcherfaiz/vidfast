import net from 'node:net';
import { API_PORT } from './config.js';

export function attachWebSocket(httpServer) {
  httpServer.on('upgrade', (req, socket, head) => {
    const url = req.url || '';
    if (!url.startsWith('/ws')) return;

    const target = net.connect(API_PORT, '127.0.0.1');
    target.on('connect', () => {
      const lines = [`GET ${url} HTTP/1.1`, `Host: 127.0.0.1:${API_PORT}`];
      for (const [key, value] of Object.entries(req.headers || {})) {
        if (!key || key.toLowerCase() === 'host') continue;
        lines.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
      }
      if (!req.headers?.upgrade) lines.push('Upgrade: websocket');
      if (!String(req.headers?.connection || '').toLowerCase().includes('upgrade')) {
        lines.push('Connection: Upgrade');
      }
      target.write(`${lines.join('\r\n')}\r\n\r\n`);
      if (head?.length) target.write(head);
      target.pipe(socket);
      socket.pipe(target);
    });
    const fail = (error) => {
      console.error('[vf:proxy] WebSocket tunnel failed', {
        url,
        remote: socket.remoteAddress,
        message: error?.message || 'socket closed'
      });
      try { target.destroy(); } catch (_) {}
      try { socket.destroy(); } catch (_) {}
    };
    target.on('error', fail);
    socket.on('error', fail);
  });
}
