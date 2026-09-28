import { getState, updateState } from 'switch-framework';
import { hydrateGuest } from './session.js';

function meId() {
  return getState('user')?.id || hydrateGuest().id;
}

export function normalizeCallMessage(m, previous = []) {
  const mine = m.fromId === meId() || m.outgoing === true || m.from === 'me';
  return {
    ...m,
    id: m.id || `m-${m.at || Date.now()}`,
    side: mine ? 'me' : 'them',
    from: mine ? 'me' : 'them',
    outgoing: mine,
    authorName: mine ? 'You' : (m.authorName || 'Guest'),
    status: mine ? (m.status || 'sent') : ''
  };
}

export function normalizeCallMessages(list, previous = []) {
  const prev = Array.isArray(previous) ? previous : [];
  return (Array.isArray(list) ? list : []).map((m) => normalizeCallMessage(m, prev));
}

export function appendCallMessage(message) {
  if (!message) return;
  const prev = getState('call-messages') || [];
  if (prev.some((m) => m.id && message.id && m.id === message.id)) return;
  if (message.fromId === meId() && prev.some((m) => (
    m.fromId === message.fromId
    && m.text === message.text
    && Math.abs((m.at || 0) - (message.at || 0)) < 8000
  ))) return;
  updateState('call-messages', [...prev, normalizeCallMessage(message, prev)]);
}

export function pushOptimisticCallMessage(text) {
  const me = getState('user') || hydrateGuest();
  const message = normalizeCallMessage({
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    fromId: me.id,
    authorName: me.name || 'You',
    avatar: me.avatar || '',
    text: String(text || '').trim(),
    at: Date.now(),
    status: 'sent'
  });
  const prev = getState('call-messages') || [];
  updateState('call-messages', [...prev, message]);
  return message;
}
