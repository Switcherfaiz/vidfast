import { SwitchComponent, getState, registerComponent, onState } from 'switch-framework';
import { meetingShareUrl } from '../../app/lib/meeting.js';
import { escapeHtml } from '../../app/lib/html.js';
import { icon } from '../../app/lib/icons.js';
import { bindReadyCard } from './functionalities.js';
import { styleSheet } from './stylesheet.js';

export class VfReadyCard extends SwitchComponent {
  static tag = 'vf-ready-card';

  onMount() {
    bindReadyCard(this);
    onState('active-call', (call) => this._paint(call || {}));
    onState('join-status', () => this._paintJoin());
    onState('join-error', () => this._paintJoin());
    onState('in-room', () => this._paintJoin());
    this._paint(getState('active-call') || {});
    this._paintJoin();
  }

  _paint(call) {
    const link = this.select('#ready-link');
    if (link) link.textContent = meetingShareUrl(call.code || call.id).replace(/^https?:\/\//, '');
    const lock = this.select('#ready-lock span');
    if (lock) lock.textContent = call.hasPassword ? 'Password on' : 'Lock room';
  }

  _paintJoin() {
    const status = getState('join-status') || 'idle';
    const live = !!getState('in-room');
    const btn = this.select('#ready-join');
    const note = this.select('#join-status');

    if (btn) {
      btn.disabled = status === 'joining';
      if (status === 'joining') btn.textContent = 'Joining…';
      else if (live || status === 'joined') btn.textContent = 'Joined';
      else btn.textContent = 'Join now';
    }

    if (!note) return;
    if (status === 'joining') {
      note.hidden = false;
      note.className = 'join-status pending';
      note.textContent = 'Connecting camera and microphone…';
      return;
    }
    if (status === 'joined' || live) {
      note.hidden = false;
      note.className = 'join-status ok';
      note.textContent = 'You joined the room successfully.';
      return;
    }
    if (status === 'error') {
      note.hidden = false;
      note.className = 'join-status err';
      note.textContent = getState('join-error') || 'Could not join the room.';
      return;
    }
    note.hidden = true;
    note.textContent = '';
  }

  render() {
    const call = getState('active-call') || {};
    const link = meetingShareUrl(call.code || call.id).replace(/^https?:\/\//, '');

    return `
      <div class="card">
        <div class="head">
          <h2>Your meeting's ready</h2>
          <button class="icon-btn" id="ready-close" type="button" aria-label="Close">${icon('close')}</button>
        </div>
        <button class="add" id="ready-add" type="button">${icon('userPlus')}<span>Share link</span></button>
        <p class="or">Anyone with this link walks in instantly as a random guest.</p>
        <div class="link-box">
          <span id="ready-link">${escapeHtml(link)}</span>
          <button class="icon-btn" id="ready-copy" type="button" aria-label="Copy link">${icon('copy')}</button>
        </div>
        <p class="note">${icon('shield')} Unguessable room id. Optional lock: first person can set a one-time password.</p>
        <button class="add" id="ready-lock" type="button" style="background:#0f172a">${icon('shield')}<span>${call.hasPassword ? 'Password on' : 'Lock room'}</span></button>
        <p class="join-status" id="join-status" hidden></p>
        <button class="join" id="ready-join" type="button">Join now</button>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfReadyCard);
