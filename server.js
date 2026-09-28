import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import switchFrameworkBackend from 'switch-framework-backend';
import { proxy } from './services/proxy/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

switchFrameworkBackend.config({
  PORT: process.env.PORT ? Number(process.env.PORT) : 3002,
  staticRoot: __dirname,
  onHttpServer: proxy.attachWebSocket
});

const app = switchFrameworkBackend();

app.initServer((server) => {
  server.use('/api', proxy.toApi);
});
