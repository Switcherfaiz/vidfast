import { Router } from 'express';
import { clearAuthCookie, getAuthToken } from '../../../middlewares/cookies.js';
import { User } from '../../../models/User.js';
import { asyncHandler } from '../../../middlewares/errorHandler.js';

export const logoutRouter = Router();

logoutRouter.post('/logout', asyncHandler(async (req, res) => {
  const token = getAuthToken(req);
  if (token) {
    await User.updateOne({ sessionToken: token }, { $set: { sessionToken: '', sessionExpires: null } });
  }
  clearAuthCookie(res);
  res.json({ success: true });
}));
