import { getState, updateState } from 'switch-framework';
import { avatarSvg, saveGuest } from './guest.js';
import { webrtc, signaling } from '../services/index.js';

export const GUEST_COLORS = ['#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#6366f1'];
export const BACKDROPS = [
  { id: 'none', label: 'Clear' },
  { id: 'blur', label: 'Blur' },
  { id: 'dusk', label: 'Dusk' },
  { id: 'ocean', label: 'Ocean' }
];

export function saveGuestProfile({ name, color, backdrop } = {}) {
  const trimmed = String(name || '').trim().slice(0, 40);
  if (!trimmed) throw new Error('Enter a display name.');
  const previous = getState('user') || {};
  const nextColor = color || previous.color || GUEST_COLORS[0];
  const next = {
    ...previous,
    name: trimmed,
    color: nextColor,
    avatar: avatarSvg(trimmed, nextColor),
    ephemeral: true
  };
  saveGuest(next);
  updateState('user', next);

  const controls = getState('call-controls') || {};
  const nextBackdrop = backdrop || controls.backdrop || 'none';
  updateState('call-controls', { ...controls, backdrop: nextBackdrop });
  webrtc.applyBackdrop(nextBackdrop);

  if (getState('in-room')) {
    signaling.broadcastProfile({
      name: next.name,
      avatar: next.avatar,
      muted: !!controls.muted,
      cameraOn: controls.cameraOn !== false,
      backdrop: nextBackdrop
    });
  }
  return next;
}
