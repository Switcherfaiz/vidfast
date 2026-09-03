import { Router } from 'express';
import { callsRouter } from './calls.js';

export function createApiRouter() {
  const router = Router();
  router.use('/calls', callsRouter);
  return router;
}
