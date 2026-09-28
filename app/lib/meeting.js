export function meetingShareUrl(code) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/meet/${code || ''}`;
}

export function parseMeetingCode(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    const fromPath = parts[parts.length - 1] || '';
    if (fromPath && fromPath !== 'meet' && fromPath !== 'join') {
      return fromPath.toLowerCase();
    }
  } catch (_) {}
  return raw.replace(/^meet\//, '').replace(/\s+/g, '').toLowerCase();
}

export function formatCallTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
