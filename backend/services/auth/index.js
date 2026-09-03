import { Router } from 'express';
import { loginRouter } from './routes/login.js';
import { registerRouter } from './routes/register.js';
import { logoutRouter } from './routes/logout.js';
import { meRouter } from './routes/me.js';

export const authApi = Router();
authApi.use('/', loginRouter);
authApi.use('/', registerRouter);
authApi.use('/', logoutRouter);
authApi.use('/', meRouter);
