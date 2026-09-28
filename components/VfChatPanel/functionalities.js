import { kickPeer } from '../../app/lib/roomSession.js';
import { muteRemoteAudio } from '../../app/lib/media.js';

export function bindChatPanel(host) {
  host.listener('.kick', 'click', (e) => {
    const id = e.currentTarget?.dataset?.kick || e.target?.closest?.('[data-kick]')?.dataset?.kick;
    if (id && confirm('Disconnect this guest from the room?')) kickPeer(id);
  });

  host.listener('.soft', 'click', (e) => {
    const btn = e.currentTarget?.dataset?.softMute ? e.currentTarget : e.target?.closest?.('[data-soft-mute]');
    const id = btn?.dataset?.softMute;
    if (!id) return;
    const on = btn.dataset.on !== '1';
    muteRemoteAudio(id, on);
    btn.dataset.on = on ? '1' : '0';
    btn.textContent = on ? 'Unmute for me' : 'Mute for me';
  });
}
