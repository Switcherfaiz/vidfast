import { AUTH_COOKIE_NAME, AUTH_COOKIE_DAYS } from '../constants/index.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  priority: 'High'
};

export function setAuthCookie(res, token, days = AUTH_COOKIE_DAYS) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  res.cookie(AUTH_COOKIE_NAME, token, { ...cookieOptions, expires });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOptions });
}

export function getAuthToken(req) {
  if (req?.cookies?.[AUTH_COOKIE_NAME]) return req.cookies[AUTH_COOKIE_NAME];
  const header = String(req?.headers?.cookie || '');
  const match = header.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(AUTH_COOKIE_NAME.length + 1));
}
