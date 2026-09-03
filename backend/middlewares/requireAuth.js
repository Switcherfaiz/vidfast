import { User } from '../models/User.js';
import { getAuthToken } from './cookies.js';
import { asyncHandler } from './errorHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const token = getAuthToken(req);
  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  const user = await User.findOne({
    sessionToken: token,
    sessionExpires: { $gt: new Date() }
  });

  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  req.user = user;
  next();
});
