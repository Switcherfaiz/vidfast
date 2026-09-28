import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Call } from './models/Call.js';
import { CallMessage } from './models/CallMessage.js';
import { DEMO_USER } from './constants/index.js';

const PARTICIPANTS = [
  {
    name: 'Kate Smith',
    avatar: 'https://i.pravatar.cc/80?u=kate-smith',
    role: 'Publisher',
    isPublisher: true,
    muted: false,
    cameraOn: true,
    videoPoster: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80'
  },
  {
    name: 'Martin Cole',
    avatar: 'https://i.pravatar.cc/80?u=martin-cole',
    role: 'participant',
    muted: true,
    cameraOn: true,
    videoPoster: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
  },
  {
    name: 'Sarah Lee',
    avatar: 'https://i.pravatar.cc/80?u=sarah-lee',
    role: 'participant',
    muted: false,
    cameraOn: true,
    videoPoster: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
  },
  {
    name: 'James Park',
    avatar: 'https://i.pravatar.cc/80?u=james-park',
    role: 'participant',
    muted: true,
    cameraOn: false,
    videoPoster: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
  },
  {
    name: 'Invite',
    avatar: '',
    role: 'invite',
    muted: false,
    cameraOn: false,
    videoPoster: ''
  }
];

async function ensureDemoUser() {
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
  let user = await User.findOne({ email: DEMO_USER.email });

  if (!user) {
    return User.create({
      name: DEMO_USER.name,
      handle: DEMO_USER.handle,
      email: DEMO_USER.email,
      passwordHash,
      avatar: DEMO_USER.avatar
    });
  }

  if (!user.passwordHash) {
    user.passwordHash = passwordHash;
    await user.save();
  }
  return user;
}

export async function seedIfEmpty() {
  const user = await ensureDemoUser();

  const missing = await Call.find({ $or: [{ code: { $exists: false } }, { code: '' }, { code: null }] });
  for (const [i, call] of missing.entries()) {
    call.code = i === 0 ? 'vah-twav-zpv' : `${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`;
    await call.save();
  }

  if (await Call.countDocuments() > 0) return;

  const call = await Call.create({
    title: 'Overview of new real estate proposals',
    code: 'vah-twav-zpv',
    badge: 'Team',
    hostId: user._id,
    invitedCount: 6,
    absentCount: 2,
    durationSeconds: 195,
    recording: true,
    transcript: "Thanks for sending all those completed transcripts through – we've been really happy with the quality and turnaround time.",
    transcriptNew: true,
    typingUser: 'Martin',
    participants: PARTICIPANTS
  });

  await CallMessage.insertMany([
    {
      callId: call._id,
      authorName: 'Martin Cole',
      avatar: 'https://i.pravatar.cc/80?u=martin-cole',
      text: 'Hey everyone! Ready to start?',
      type: 'message',
      outgoing: false,
      at: Date.now() - 360000
    },
    {
      callId: call._id,
      authorName: 'You',
      avatar: user.avatar,
      text: 'Yes, lets dive into the real estate proposals.',
      type: 'message',
      outgoing: true,
      at: Date.now() - 300000
    },
    {
      callId: call._id,
      authorName: 'System',
      avatar: '',
      text: 'Started the call',
      type: 'system',
      outgoing: false,
      at: Date.now() - 240000
    },
    {
      callId: call._id,
      authorName: 'Sarah Lee',
      avatar: 'https://i.pravatar.cc/80?u=sarah-lee',
      text: 'I reviewed the downtown listings — looks promising.',
      type: 'message',
      outgoing: false,
      at: Date.now() - 120000
    },
    {
      callId: call._id,
      authorName: 'James Park',
      avatar: 'https://i.pravatar.cc/80?u=james-park',
      text: 'Can we go over the pricing model next?',
      type: 'message',
      outgoing: false,
      at: Date.now() - 60000
    }
  ]);
}
