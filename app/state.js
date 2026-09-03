import { getState } from 'switch-framework';

export function getUser() {
  return getState('user');
}

export function getActiveCall() {
  return getState('active-call') || null;
}

export function getCallMessages() {
  const msgs = getState('call-messages');
  return Array.isArray(msgs) ? msgs : [];
}

export function getChatTab() {
  return getState('chat-tab') || 'messages';
}

export function getCallControls() {
  return getState('call-controls') || { muted: false, cameraOn: true, volume: 70 };
}
