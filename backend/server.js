import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { signaling } from './services/websocket/signaling/index.js';
import { connectDb } from './config/db.js';

const PORT = Number(process.env.PORT || 4002);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3002';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, mode: 'persistent-mongo' }));

app.post('/api/rooms', async (req, res, next) => {
  try {
    const room = await signaling.createRoom(req.body?.title, req.body?.password);
    res.status(201).json({ room: signaling.publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/rooms/:code', async (req, res, next) => {
  try {
    const room = await signaling.getRoom(req.params.code);
    if (!room) return res.status(404).json({ error: 'Meeting not found.' });
    res.json({ room: signaling.publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/rooms/:code/password', async (req, res, next) => {
  try {
    const room = await signaling.getRoom(req.params.code);
    if (!room) return res.status(404).json({ error: 'Meeting not found.' });
    if (room.peers.size > 0) {
      return res.status(409).json({ error: 'Lock the room from inside the call once people have joined.' });
    }
    await signaling.setRoomPassword(room, req.body?.password);
    res.json({ room: signaling.publicRoom(room) });
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((error, _req, res, _next) => {
  console.error('[vf:api]', error);
  res.status(500).json({ error: 'Server error' });
});

const server = http.createServer(app);
signaling.attachSignal(server);

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vidfast';
await connectDb(mongoUri);
server.listen(PORT, () => {
  console.log(`VidFast signaling (MongoDB rooms) at http://localhost:${PORT}`);
});
