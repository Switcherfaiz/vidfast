import { getState, updateState } from 'switch-framework';
import { meetingShareUrl } from '../../app/lib/meeting.js';
import { icon } from '../../app/lib/icons.js';
import { enterFromMeet } from '../../app/meet/functionalities.js';
import { setRoomPassword } from '../../app/lib/roomSession.js';

export function bindReadyCard(host) {
  host.listener('#ready-close', 'click', () => {
    if (getState('join-status') === 'joining') return;
    updateState('ready-dismissed', true);
  });

  host.listener('#ready-join', 'click', async () => {
    if (getState('join-status') === 'joining') return;
    try {
      await enterFromMeet();
    } catch (err) {
      updateState('join-status', 'error');
      updateState('join-error', err?.message || 'Could not join the room.');
    }
  });

  host.listener('#ready-copy', 'click', async () => {
    const call = getState('active-call') || {};
    const url = meetingShareUrl(call.code || call.id);
    try {
      await navigator.clipboard.writeText(url);
      const btn = host.select('#ready-copy');
      if (btn) {
        btn.innerHTML = icon('check');
        setTimeout(() => { if (btn) btn.innerHTML = icon('copy'); }, 1400);
      }
    } catch (_) {}
  });

  host.listener('#ready-add', 'click', async () => {
    const call = getState('active-call') || {};
    const url = meetingShareUrl(call.code || call.id);
    try { await navigator.clipboard.writeText(url); } catch (_) {}
    const add = host.select('#ready-add');
    if (add) {
      const span = add.querySelector('span');
      if (span) span.textContent = 'Link copied';
      setTimeout(() => { if (span) span.textContent = 'Share link'; }, 1400);
    }
  });

  host.listener('#ready-lock', 'click', () => {
    const password = prompt('Set a temporary room password (empty to unlock)');
    if (password == null) return;
    setRoomPassword(password);
    updateState('meeting-password', password);
    const call = getState('active-call') || {};
    updateState('active-call', { ...call, hasPassword: !!password });
  });
}
