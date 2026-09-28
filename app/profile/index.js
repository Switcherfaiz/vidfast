import { SwitchComponent, getState, onState } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { escapeAttr, escapeHtml } from '../lib/html.js';
import { avatarSvg } from '../lib/guest.js';
import { BACKDROPS, GUEST_COLORS, saveGuestProfile } from '../lib/guestProfile.js';
import { icon } from '../lib/icons.js';
import { styleSheet } from './stylesheet.js';

export class VfProfileScreen extends SwitchComponent {
  static screenName = 'profile';
  static path = '/profile';
  static title = 'Your profile';
  static tag = 'vf-profile-screen';

  onMount() {
    const user = getState('user') || {};
    this._color = user.color || GUEST_COLORS[0];
    this._backdrop = getState('call-controls')?.backdrop || 'none';
    this.listener('#profile-back', 'click', () => navigate('join'));
    this.listener('#profile-name', 'input', () => this._paintPreview());
    this.listener('[data-color]', 'click', (event) => {
      this._color = event.currentTarget?.dataset.color || this._color;
      this._paintChoices();
      this._paintPreview();
    });
    this.listener('[data-backdrop]', 'click', (event) => {
      this._backdrop = event.currentTarget?.dataset.backdrop || this._backdrop;
      this._paintChoices();
    });
    this.listener('#profile-save', 'click', () => this._save());
    onState('user', () => this._paintPreview());
    this._paintChoices();
  }

  _paintPreview() {
    const current = getState('user') || {};
    const name = String(this.select('#profile-name')?.value || current.name || 'Guest').trim() || 'Guest';
    const avatar = this.select('#profile-avatar');
    if (avatar) avatar.src = avatarSvg(name, this._color || current.color);
    const label = this.select('#profile-preview-name');
    if (label) label.textContent = name;
  }

  _paintChoices() {
    this.selectAll('[data-color]').forEach((button) => button.classList.toggle('on', button.dataset.color === this._color));
    this.selectAll('[data-backdrop]').forEach((button) => button.classList.toggle('on', button.dataset.backdrop === this._backdrop));
  }

  _save() {
    const status = this.select('#profile-status');
    try {
      saveGuestProfile({
        name: this.select('#profile-name')?.value,
        color: this._color,
        backdrop: this._backdrop
      });
      if (status) {
        status.textContent = 'Saved in this browser tab';
        status.classList.remove('err');
      }
      this._paintPreview();
    } catch (error) {
      if (status) {
        status.textContent = error?.message || 'Could not save profile';
        status.classList.add('err');
      }
    }
  }

  render() {
    const user = getState('user') || {};
    const color = user.color || GUEST_COLORS[0];
    return `
      <main class="page">
        <header class="top">
          <button class="round" id="profile-back" type="button" aria-label="Back">${icon('back')}</button>
          <div>
            <p class="eyebrow">VidFast guest</p>
            <h1>Your profile</h1>
          </div>
          <span class="temporary">Temporary</span>
        </header>

        <section class="hero-card">
          <div class="avatar-wrap">
            <img id="profile-avatar" src="${escapeAttr(user.avatar || avatarSvg(user.name, color))}" alt="" />
            <span class="online"></span>
          </div>
          <div>
            <h2 id="profile-preview-name">${escapeHtml(user.name || 'Guest')}</h2>
            <p>Stored only in this browser tab. It is shared with peers only while you are in a meeting.</p>
          </div>
        </section>

        <section class="card">
          <h3>Identity</h3>
          <label>Display name
            <input id="profile-name" type="text" maxlength="40" value="${escapeAttr(user.name || '')}" />
          </label>
          <div class="field">
            <span>Avatar color</span>
            <div class="colors">
              ${GUEST_COLORS.map((item) => `<button type="button" data-color="${item}" style="--color:${item}" aria-label="${item}"></button>`).join('')}
            </div>
          </div>
        </section>

        <section class="card">
          <h3>Camera backdrop</h3>
          <div class="backs">
            ${BACKDROPS.map((item) => `<button type="button" data-backdrop="${item.id}">${escapeHtml(item.label)}</button>`).join('')}
          </div>
        </section>

        <button class="save" id="profile-save" type="button">Save profile</button>
        <p class="status" id="profile-status"></p>
      </main>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}
