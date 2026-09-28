import 'dotenv/config';
import path from 'path';
import http from 'node:http';
import net from 'node:net';
import { fileURLToPath } from 'url';
import switchFrameworkBackend from 'switch-framework-backend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_PORT = Number(process.env.API_PORT || 4002);

function proxyToApi(req, res) {
  const headers = { ...req.headers, host: `127.0.0.1:${API_PORT}` };
  delete headers['content-length'];

  let payload = null;
  if (req.body && Object.keys(req.body).length && !String(req.headers['content-type'] || '').includes('multipart')) {
    payload = Buffer.from(JSON.stringify(req.body));
    headers['content-type'] = 'application/json';
    headers['content-length'] = String(payload.length);
  }

  const proxy = http.request({
    hostname: '127.0.0.1',
    port: API_PORT,
    path: req.originalUrl,
    method: req.method,
    headers
  }, (incoming) => {
    res.writeHead(incoming.statusCode || 502, incoming.headers);
    incoming.pipe(res);
  });

  proxy.on('error', (error) => {
    console.error('[vf:proxy] API request failed', { path: req.originalUrl, message: error.message });
    if (!res.headersSent) {
      res.status(502).json({
        error: `API is not running. Start it with npm run dev:backend (port ${API_PORT}).`
      });
    }
  });

  if (payload) {
    proxy.end(payload);
    return;
  }
  req.pipe(proxy);
}

function proxyWebSocket(httpServer) {
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

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 3002,
  staticRoot: __dirname,
  onHttpServer: proxyWebSocket
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', proxyToApi);
});
