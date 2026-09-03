import { Router } from 'express';
import { Call } from '../models/Call.js';
import { CallMessage } from '../models/CallMessage.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const callsRouter = Router();

callsRouter.get('/', asyncHandler(async (_req, res) => {
  const calls = await Call.find().sort({ updatedAt: -1 }).limit(20);
  res.json({ calls });
}));

callsRouter.get('/:id', asyncHandler(async (req, res) => {
  const call = await Call.findById(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });
  res.json({ call });
}));

callsRouter.post('/', asyncHandler(async (req, res) => {
  const title = String(req.body?.title || 'New meeting').trim();
  const call = await Call.create({
    title,
    badge: 'Team',
    hostId: req.user._id,
    invitedCount: 1,
    absentCount: 0,
    durationSeconds: 0,
    participants: [{
      name: req.user.name,
      avatar: req.user.avatar,
      isPublisher: true,
      role: 'Publisher',
      muted: false,
      cameraOn: true,
      videoPoster: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
    }]
  });
  res.status(201).json({ call });
}));

callsRouter.get('/:id/messages', asyncHandler(async (req, res) => {
  const messages = await CallMessage.find({ callId: req.params.id }).sort({ at: 1 });
  res.json({ messages });
}));

callsRouter.post('/:id/messages', asyncHandler(async (req, res) => {
  const text = String(req.body?.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Text required' });

  const call = await Call.findById(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  const message = await CallMessage.create({
    callId: call._id,
    authorId: req.user._id,
    authorName: req.user.name,
    avatar: req.user.avatar,
    text,
    type: 'message',
    outgoing: true,
    at: Date.now()
  });

  call.typingUser = '';
  await call.save();
  res.status(201).json({ message });
}));

callsRouter.patch('/:id/controls', asyncHandler(async (req, res) => {
  const call = await Call.findById(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  const { muted, cameraOn } = req.body || {};
  const publisher = call.participants.find((p) => p.isPublisher);
  if (publisher) {
    if (typeof muted === 'boolean') publisher.muted = muted;
    if (typeof cameraOn === 'boolean') publisher.cameraOn = cameraOn;
  }
  await call.save();
  res.json({ call });
}));
