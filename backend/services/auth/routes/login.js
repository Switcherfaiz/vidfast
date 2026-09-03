import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { User } from '../../../models/User.js';
import { AUTH_COOKIE_DAYS } from '../../../constants/index.js';
import { loginRateLimiter } from '../../../middlewares/loginRateLimiter.js';
import { setAuthCookie } from '../../../middlewares/cookies.js';
import { asyncHandler } from '../../../middlewares/errorHandler.js';
import { publicUser, sessionExpiry } from '../publicUser.js';

export const loginRouter = Router();

loginRouter.post('/login', loginRateLimiter, asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user?.passwordHash) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ success: false, error: 'Invalid email or password' });
    return;
  }

  user.sessionToken = crypto.randomBytes(32).toString('hex');
  user.sessionExpires = sessionExpiry(AUTH_COOKIE_DAYS);
  await user.save();

  setAuthCookie(res, user.sessionToken, AUTH_COOKIE_DAYS);
  res.json({ success: true, user: publicUser(user) });
}));
