import { Router } from 'express';
import { getAuthToken } from '../../../middlewares/cookies.js';
import { User } from '../../../models/User.js';
import { asyncHandler } from '../../../middlewares/errorHandler.js';
import { publicUser } from '../publicUser.js';

export const meRouter = Router();

meRouter.get('/me', asyncHandler(async (req, res) => {
  const token = getAuthToken(req);
  if (!token) {
    res.json({ user: null });
    return;
  }

  const user = await User.findOne({
    sessionToken: token,
    sessionExpires: { $gt: new Date() }
  });

  res.json({ user: publicUser(user) });
}));
