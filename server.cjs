require('dotenv').config();

const path = require('node:path');
const http = require('node:http');
const switchFrameworkBackend = require('switch-framework-backend');

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

  proxy.on('error', () => {
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

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 3002,
  staticRoot: path.join(__dirname, '.'),
  session: {
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
  }
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', proxyToApi);
});
