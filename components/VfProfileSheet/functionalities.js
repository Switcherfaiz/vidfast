import { getState, updateState } from 'switch-framework';
import { applyBackdrop } from '../../app/lib/media.js';
import { broadcastProfile } from '../../app/lib/roomSession.js';
import { saveGuestProfile } from '../../app/lib/guestProfile.js';

export function bindProfileSheet(host) {
  host.listener('#profile-close', 'click', () => updateState('profile-open', false));
  host.listener('#profile-veil', 'click', (e) => {
    if (e.target?.id === 'profile-veil') updateState('profile-open', false);
  });

  host.listener('[data-backdrop]', 'click', (e) => {
    const mode = e.currentTarget?.dataset?.backdrop || e.target?.closest?.('[data-backdrop]')?.dataset?.backdrop;
    if (!mode) return;
    const prev = getState('call-controls') || {};
    updateState('call-controls', { ...prev, backdrop: mode });
    applyBackdrop(mode);
    if (getState('in-room')) broadcastProfile({ backdrop: mode });
  });

  host.listener('#profile-save', 'click', () => {
    const name = String(host.select('#profile-name')?.value || '').trim().slice(0, 40);
    if (!name) return;
    saveGuestProfile({ name, backdrop: getState('call-controls')?.backdrop || 'none' });
    updateState('profile-open', false);
  });
}
