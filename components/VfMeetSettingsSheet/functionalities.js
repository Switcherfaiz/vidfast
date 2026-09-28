import { getState, updateState } from 'switch-framework';
import { meetingShareUrl } from '../../app/lib/meeting.js';
import { icon } from '../../app/lib/icons.js';
import { setRoomPassword } from '../../app/lib/roomSession.js';
import { diagnosticsText } from '../../app/lib/webrtcDiagnostics.js';

function canManageLock() {
  const call = getState('active-call') || {};
  const user = getState('user') || {};
  if (call.hostId && call.hostId === user.id) return true;
  if (!getState('in-room') && (call.peerCount || 0) === 0) return true;
  return false;
}

function setStatus(host, text, ok = true) {
  const el = host.select('#settings-status');
  if (!el) return;
  el.textContent = text || '';
  el.classList.toggle('err', !ok);
  if (text) {
    clearTimeout(host._statusTimer);
    host._statusTimer = setTimeout(() => { if (el) el.textContent = ''; }, 3200);
  }
}

function setLockBusy(host, busy) {
  host._lockBusy = busy;
  const save = host.select('#settings-save-password');
  const clear = host.select('#settings-clear-password');
  if (save) save.disabled = busy || (getState('in-room') && !canManageLock());
  if (clear) clear.disabled = busy;
}

export function bindMeetSettings(host) {
  host.listener('#settings-close', 'click', () => updateState('meet-settings-open', false));
  host.listener('#settings-veil', 'click', (e) => {
    if (e.target?.id === 'settings-veil') updateState('meet-settings-open', false);
  });

  host.listener('#settings-copy', 'click', async () => {
    const call = getState('active-call') || {};
    const url = meetingShareUrl(call.code || call.id);
    try {
      await navigator.clipboard.writeText(url);
      setStatus(host, 'Invite link copied');
      const btn = host.select('#settings-copy');
      if (btn) {
        btn.innerHTML = icon('check');
        setTimeout(() => { if (btn) btn.innerHTML = icon('copy'); }, 1400);
      }
    } catch (_) {
      setStatus(host, 'Could not copy link', false);
    }
  });

  host.listener('#settings-profile', 'click', () => {
    updateState('meet-settings-open', false);
    updateState('profile-open', true);
  });

  host.listener('#settings-copy-diagnostics', 'click', async () => {
    try {
      await navigator.clipboard.writeText(diagnosticsText());
      setStatus(host, 'Connection logs copied');
    } catch (_) {
      setStatus(host, 'Could not copy connection logs', false);
    }
  });

  host.listener('#settings-captions', 'click', () => {
    const prev = getState('call-controls') || {};
    updateState('call-controls', { ...prev, captions: !prev.captions });
    host._paintToggles();
  });

  host.listener('#settings-save-password', 'click', async () => {
    if (!canManageLock()) {
      setStatus(host, 'Only the host can change the password', false);
      return;
    }
    const input = host.select('#settings-password');
    const password = String(input?.value || '').trim();
    if (!password) {
      setStatus(host, 'Enter a password or use Remove lock', false);
      return;
    }
    if (host._lockBusy) return;
    setLockBusy(host, true);
    setStatus(host, 'Saving password…');
    try {
      await setRoomPassword(password);
      updateState('meeting-password', password);
      setStatus(host, 'Room password updated');
      host._paintRoomMeta();
    } catch (err) {
      setStatus(host, err?.message || 'Could not set password', false);
    } finally {
      setLockBusy(host, false);
    }
  });

  host.listener('#settings-clear-password', 'click', async () => {
    if (!canManageLock()) {
      setStatus(host, 'Only the host can remove the password', false);
      return;
    }
    if (host._lockBusy) return;
    setLockBusy(host, true);
    setStatus(host, 'Removing lock…');
    try {
      await setRoomPassword('');
      updateState('meeting-password', '');
      const input = host.select('#settings-password');
      if (input) input.value = '';
      setStatus(host, 'Room lock removed — anyone can join now');
      host._paintRoomMeta();
    } catch (err) {
      setStatus(host, err?.message || 'Could not remove password', false);
    } finally {
      setLockBusy(host, false);
    }
  });
}
