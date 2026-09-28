import { SwitchComponent, getState, updateState } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { escapeHtml, escapeAttr } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { parseMeetingCode } from '../lib/meeting.js';
import { createRoom, fetchRoom } from '../api.js';
import { requestMeetingPassword } from '../lib/passwordPrompt.js';
import { styleSheet } from './stylesheet.js';

export class VfJoinScreen extends SwitchComponent {
  static screenName = 'join';
  static path = '/join';
  static title = 'VidFast';
  static tag = 'vf-join-screen';

  _error = '';
  _loading = false;

  onMount() {
    this.listener('#new-meeting', 'click', () => this._create());
    this.listener('#join_btn', 'click', () => this._join());
    this.listener('#edit-guest', 'click', () => navigate('profile'));
    this.listener('#link_input', 'input', (e) => updateState('meeting-link', e.target.value || ''));
    this.listener('#link_input', 'keydown', (e) => {
      if (e.key === 'Enter') this._join();
    });
  }

  async _create() {
    const btn = this.select('#new-meeting');
    if (btn) btn.disabled = true;
    try {
      const user = getState('user') || {};
      const { room } = await createRoom('VidFast meeting');
      updateState('active-call', { ...room, hostId: user.id || room.hostId });
      if (room?.code) navigate(`meet/${room.code}`);
    } catch (err) {
      alert(err?.message || 'Could not create a meeting.');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async _join() {
    if (this._loading) return;
    const code = parseMeetingCode(this.select('#link_input')?.value || getState('meeting-link'));
    if (!code) {
      this._error = 'Paste a meeting link or code.';
      this._paintError();
      return;
    }
    this._loading = true;
    this._error = '';
    this._paintError();
    const btn = this.select('#join_btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Opening...'; }
    try {
      const { room } = await fetchRoom(code);
      let password = String(this.select('#pass_input')?.value || '').trim();
      if (room.hasPassword && !password) {
        password = await requestMeetingPassword('This room is locked. Enter the password to continue.');
        if (!password) {
          this._error = 'Password required for this room.';
          this._paintError();
          this._loading = false;
          if (btn) { btn.disabled = false; btn.textContent = 'Enter now'; }
          return;
        }
      }
      updateState('active-call', room);
      updateState('meeting-link', '');
      updateState('meeting-password', password);
      navigate(`meet/${room.code}`);
    } catch (err) {
      this._error = err?.message || 'Meeting not found.';
      this._paintError();
      this._loading = false;
      if (btn) { btn.disabled = false; btn.textContent = 'Enter now'; }
    }
  }

  _paintError() {
    const el = this.select('#error');
    if (!el) return;
    el.textContent = this._error || '';
    el.hidden = !this._error;
  }

  render() {
    const user = getState('user') || {};
    const link = getState('meeting-link') || '';
    return `
      <div class="page">
        <header class="top">
          <div class="brand">
            <img src="/assets/logo.svg" alt="VidFast" />
            <div>
              <div class="kicker">No accounts</div>
              <h1>Meet and vanish</h1>
            </div>
          </div>
          <button class="who" id="edit-guest" type="button">
            <img src="${escapeAttr(user.avatar || '')}" alt="" />
            <div class="who-meta">
              <strong>${escapeHtml(user.name || 'Guest')}</strong>
              <span>Temporary this tab</span>
            </div>
          </button>
        </header>

        <button id="new-meeting" class="hero" type="button">
          <span class="ic">${icon('video', 26)}</span>
          <div>
            <strong>New meeting</strong>
            <p>Get a private link. Share it. Leave and it is gone.</p>
          </div>
        </button>

        <section class="card">
          <h2>Join with a link</h2>
          <p>Paste a code. You walk in as ${escapeHtml(user.name || 'a guest')}.</p>
          <input id="link_input" type="text" placeholder="localhost:3002/meet/a3f91c-k2wq8n-1p7b4d" value="${escapeAttr(link)}" />
          <input id="pass_input" type="password" placeholder="Room password (if any)" />
          <p id="error" class="error" ${this._error ? '' : 'hidden'}>${escapeAttr(this._error)}</p>
          <button id="join_btn" type="button">Enter now</button>
        </section>
        <vf-password-sheet></vf-password-sheet>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}
