import { SwitchComponent, getState, registerComponent, onState } from 'switch-framework';
import { meetingShareUrl } from '../../app/lib/meeting.js';
import { escapeHtml } from '../../app/lib/html.js';
import { icon } from '../../app/lib/icons.js';
import { styleSheet } from './stylesheet.js';
import { bindMeetSettings } from './functionalities.js';

export class VfMeetSettingsSheet extends SwitchComponent {
  static tag = 'vf-meet-settings-sheet';

  onMount() {
    bindMeetSettings(this);
    onState('meet-settings-open', (open) => this._paintOpen(open === true));
    onState('active-call', () => this._paintRoomMeta());
    onState('in-room', () => this._paintRoomMeta());
    onState('call-controls', () => this._paintToggles());
    onState('webrtc-diagnostics', () => this._paintDiagnostics());
    this._paintOpen(getState('meet-settings-open') === true);
    this._paintRoomMeta();
    this._paintToggles();
    this._paintDiagnostics();
  }

  _paintOpen(open) {
    const veil = this.select('#settings-veil');
    if (!veil) return;
    veil.classList.toggle('on', open);
    veil.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  _paintRoomMeta() {
    const call = getState('active-call') || {};
    const user = getState('user') || {};
    const host = call.hostId && call.hostId === user.id;
    const live = !!getState('in-room');
    const canManage = host || (!live && (call.peerCount || 0) === 0);
    const link = meetingShareUrl(call.code || call.id).replace(/^https?:\/\//, '');

    const linkEl = this.select('#settings-link');
    if (linkEl) linkEl.textContent = link;

    const badge = this.select('#settings-lock-badge');
    if (badge) badge.hidden = !call.hasPassword;

    const hostNote = this.select('#settings-host-note');
    if (hostNote) {
      hostNote.textContent = host
        ? 'You are the host — you can lock this room.'
        : canManage
          ? 'Nobody has joined yet — you can set or remove the room lock.'
          : live
            ? 'Only the host can change room security settings.'
            : 'Join the call to manage live room settings.';
    }

    const pwSection = this.select('#settings-password-section');
    if (pwSection) pwSection.hidden = live && !host && (call.peerCount || 0) > 0;

    const save = this.select('#settings-save-password');
    const clear = this.select('#settings-clear-password');
    if (save) save.disabled = !canManage || this._lockBusy;
    if (clear) {
      clear.hidden = !call.hasPassword;
      clear.disabled = !canManage || this._lockBusy;
    }
  }

  _paintToggles() {
    const controls = getState('call-controls') || {};
    this.select('#settings-captions')?.classList.toggle('on', !!controls.captions);
  }

  _paintDiagnostics() {
    const diagnostics = getState('webrtc-diagnostics') || {};
    const el = this.select('#settings-connection');
    if (el) {
      const transport = diagnostics.transport && diagnostics.transport !== 'unknown'
        ? ` · ${diagnostics.transport}`
        : '';
      el.textContent = `${diagnostics.status || 'idle'}${transport}`;
    }
  }

  render() {
    const call = getState('active-call') || {};
    const link = meetingShareUrl(call.code || call.id).replace(/^https?:\/\//, '');

    return `
      <div class="veil" id="settings-veil" aria-hidden="true">
        <div class="sheet" role="dialog" aria-label="Meeting settings">
          <header>
            <h2>Meeting settings</h2>
            <button class="x" id="settings-close" type="button" aria-label="Close">${icon('close')}</button>
          </header>
          <p class="hint" id="settings-host-note">Room settings for this meeting link.</p>

          <div class="section">
            <h3>Invite</h3>
            <div class="link-box">
              <span id="settings-link">${escapeHtml(link)}</span>
              <button class="btn ghost icon" id="settings-copy" type="button" aria-label="Copy link">${icon('copy')}</button>
            </div>
            <p class="note">Anyone with this link can join as a random guest.</p>
          </div>

          <div class="section" id="settings-password-section">
            <h3>Room lock</h3>
            <span class="badge" id="settings-lock-badge" ${call.hasPassword ? '' : 'hidden'}>${icon('shield', 12)} Password on</span>
            <label>
              Temporary password
              <input id="settings-password" type="password" maxlength="64" placeholder="Set a one-time room password" autocomplete="new-password" />
            </label>
            <div class="row">
              <button class="btn primary" id="settings-save-password" type="button">Save password</button>
              <button class="btn warn" id="settings-clear-password" type="button" ${call.hasPassword ? '' : 'hidden'}>Remove lock</button>
            </div>
            <p class="note">Guests will need this password to enter. Empty the field and remove lock to open the room again.</p>
          </div>

          <div class="section">
            <h3>In-call</h3>
            <div class="toggle">
              <span>Live captions (preview)</span>
              <button class="switch" id="settings-captions" type="button" aria-label="Toggle captions"></button>
            </div>
            <button class="btn ghost" id="settings-profile" type="button">Edit your name & backdrop</button>
          </div>

          <div class="section">
            <h3>Connection diagnostics</h3>
            <p class="note">Status: <strong id="settings-connection">idle</strong></p>
            <button class="btn ghost" id="settings-copy-diagnostics" type="button">Copy connection logs</button>
            <p class="note">A relay connection is normally required between home Wi-Fi and mobile carrier data.</p>
          </div>

          <p class="status" id="settings-status"></p>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfMeetSettingsSheet);
