import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, MONGODB_URI, CLIENT_ORIGIN } from './constants/index.js';
import { connectDb } from './config/db.js';
import { seedIfEmpty } from './seed.js';
import { createApiRouter } from './routes/index.js';
import { authApi } from './services/auth/index.js';
import { requireAuth } from './middlewares/requireAuth.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authApi);
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', requireAuth, createApiRouter());
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDb(MONGODB_URI);
    await seedIfEmpty();
    console.log(`MongoDB connected (${MONGODB_URI})`);
  } catch (err) {
    console.error('MongoDB connection failed. Start MongoDB and retry.');
    console.error(err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`VidFast API running at http://localhost:${PORT}`);
  });
}

start();
