export function publicUser(user, extra = {}) {
  if (!user) return null;
  const json = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  delete json.passwordHash;
  delete json.sessionToken;
  delete json.sessionExpires;
  return { ...json, ...extra };
}

export function sessionExpiry(days = 7) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
