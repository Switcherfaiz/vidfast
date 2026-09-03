import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { User } from '../../../models/User.js';
import { AUTH_COOKIE_DAYS } from '../../../constants/index.js';
import { setAuthCookie } from '../../../middlewares/cookies.js';
import { asyncHandler } from '../../../middlewares/errorHandler.js';
import { publicUser, sessionExpiry } from '../publicUser.js';

export const registerRouter = Router();

registerRouter.post('/register', asyncHandler(async (req, res) => {
  const name = String(req.body?.name || '').trim() || 'User';
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409).json({ success: false, error: 'Email already registered' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    handle: email.split('@')[0],
    email,
    passwordHash,
    avatar: `https://i.pravatar.cc/160?u=${encodeURIComponent(email)}`
  });

  user.sessionToken = crypto.randomBytes(32).toString('hex');
  user.sessionExpires = sessionExpiry(AUTH_COOKIE_DAYS);
  await user.save();

  setAuthCookie(res, user.sessionToken, AUTH_COOKIE_DAYS);
  res.status(201).json({ success: true, user: publicUser(user) });
}));
