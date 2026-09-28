const ADJECTIVES = [
  'Anonymous', 'Silent', 'Brave', 'Quick', 'Calm', 'Bright', 'Lucky', 'Nimble',
  'Cosmic', 'Hidden', 'Gentle', 'Vivid', 'Clever', 'Swift', 'Quiet', 'Bold'
];

const ANIMALS = [
  'Otter', 'Falcon', 'Panda', 'Fox', 'Lynx', 'Koala', 'Heron', 'Tiger',
  'Orchid', 'Wren', 'Wolf', 'Seal', 'Hawk', 'Mink', 'Ibis', 'Yak'
];

const COLORS = ['#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#6366f1'];

function rand(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function uuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `user-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 6)}`;
}

export function avatarSvg(name, color) {
  const initial = String(name || 'G').charAt(0).toUpperCase();
  const fill = color || rand(COLORS);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="${fill}"/><text x="50%" y="54%" text-anchor="middle" fill="#fff" font-size="34" font-family="DM Sans,system-ui,sans-serif" font-weight="800">${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createGuest() {
  const name = `${rand(ADJECTIVES)} ${rand(ANIMALS)}`;
  const color = rand(COLORS);
  return {
    id: uuid(),
    name,
    avatar: avatarSvg(name, color),
    color,
    ephemeral: true
  };
}

export function ensureGuest() {
  try {
    const raw = sessionStorage.getItem('vf-guest');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.id && parsed?.name) return parsed;
    }
  } catch (_) {}
  const guest = createGuest();
  try { sessionStorage.setItem('vf-guest', JSON.stringify(guest)); } catch (_) {}
  return guest;
}

export function saveGuest(guest) {
  try { sessionStorage.setItem('vf-guest', JSON.stringify(guest)); } catch (_) {}
  return guest;
}

export function forgetGuest() {
  try { sessionStorage.removeItem('vf-guest'); } catch (_) {}
}
