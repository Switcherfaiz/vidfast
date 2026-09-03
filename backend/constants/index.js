const PORT = Number(process.env.PORT || 4002);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vidfast';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3002';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'vf_auth';
const AUTH_COOKIE_DAYS = Number(process.env.AUTH_COOKIE_DAYS || 7);

const DEMO_USER = {
  name: 'Kate Smith',
  handle: 'kate_smith',
  email: process.env.DEMO_EMAIL || 'kate@vidfast.app',
  password: process.env.DEMO_PASSWORD || 'vid123',
  avatar: 'https://i.pravatar.cc/160?u=kate-smith'
};

export {
  PORT,
  MONGODB_URI,
  CLIENT_ORIGIN,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_DAYS,
  DEMO_USER
};
