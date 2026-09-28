import { Router } from 'express';
import { Call } from '../models/Call.js';
import { CallMessage } from '../models/CallMessage.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const callsRouter = Router();

function makeMeetingCode() {
  const chunk = (n) => Math.random().toString(36).slice(2, 2 + n);
  return `${chunk(3)}-${chunk(4)}-${chunk(3)}`.toLowerCase();
}

callsRouter.get('/', asyncHandler(async (_req, res) => {
  const calls = await Call.find().sort({ updatedAt: -1 }).limit(20);
  res.json({ calls });
}));

callsRouter.get('/code/:code', asyncHandler(async (req, res) => {
  const code = String(req.params.code || '').trim().toLowerCase();
  const call = await Call.findOne({ code });
  if (!call) return res.status(404).json({ error: 'Meeting not found' });
  res.json({ call });
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
    code: makeMeetingCode(),
    badge: 'Team',
    hostId: req.user._id,
    invitedCount: 1,
    absentCount: 0,
    durationSeconds: 0,
    transcript: 'Welcome in — chat is open on the right whenever you need it.',
    participants: [{
      name: req.user.name,
      avatar: req.user.avatar,
      isPublisher: true,
      role: 'Publisher',
      muted: false,
      cameraOn: true,
      videoPoster: req.user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80'
    }]
  });
  res.status(201).json({ call });
}));

callsRouter.post('/:id/join', asyncHandler(async (req, res) => {
  const call = await Call.findById(req.params.id);
  if (!call) return res.status(404).json({ error: 'Call not found' });

  const already = call.participants.some((p) => p.name === req.user.name && p.avatar === req.user.avatar);
  if (!already) {
    call.participants.push({
      name: req.user.name,
      avatar: req.user.avatar,
      role: 'participant',
      muted: false,
      cameraOn: true,
      videoPoster: req.user.avatar || ''
    });
    call.invitedCount = (call.invitedCount || 0) + 1;
    await call.save();
  }
  res.json({ call });
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
