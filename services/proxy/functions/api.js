import http from 'node:http';
import { API_PORT } from './config.js';

export function toApi(req, res) {
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
