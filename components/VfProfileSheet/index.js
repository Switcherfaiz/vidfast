import { SwitchComponent, getState, createProps, registerComponent, onState } from 'switch-framework';
import '../VfAvatar/index.js';
import { escapeHtml, escapeAttr } from '../../app/lib/html.js';
import { icon } from '../../app/lib/icons.js';
import { styleSheet } from './stylesheet.js';
import { bindProfileSheet } from './functionalities.js';
import { BACKDROPS } from '../../app/lib/guestProfile.js';

export class VfProfileSheet extends SwitchComponent {
  static tag = 'vf-profile-sheet';

  onMount() {
    bindProfileSheet(this);
    onState('profile-open', (open) => this._paintOpen(open === true));
    onState('user', (user) => this._paintUser(user || {}));
    onState('call-controls', (controls) => this._paintBackdrops(controls || {}));
    this._paintOpen(getState('profile-open') === true);
    this._paintUser(getState('user') || {});
    this._paintBackdrops(getState('call-controls') || {});
  }

  _paintOpen(open) {
    const veil = this.select('#profile-veil');
    if (!veil) return;
    veil.classList.toggle('on', open);
    veil.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  _paintUser(user) {
    const input = this.select('#profile-name');
    if (input && document.activeElement !== input) input.value = user.name || '';
  }

  _paintBackdrops(controls) {
    const active = controls.backdrop || 'none';
    this.selectAll('[data-backdrop]').forEach((btn) => btn.classList.toggle('on', btn.dataset.backdrop === active));
  }

  render() {
    const user = getState('user') || {};

    return `
      <div class="veil" id="profile-veil" aria-hidden="true">
        <div class="sheet" role="dialog" aria-label="Guest profile">
          <header>
            <h2>This tab only</h2>
            <button class="x" id="profile-close" type="button" aria-label="Close">${icon('close')}</button>
          </header>
          <vf-avatar data="${createProps({ src: user.avatar, name: user.name, size: 72 })}"></vf-avatar>
          <p class="hint">Name and backdrop live in memory. Close the tab and they vanish.</p>
          <label>
            Display name
            <input id="profile-name" type="text" maxlength="40" value="${escapeAttr(user.name || '')}" />
          </label>
          <div class="backs">
            ${BACKDROPS.map((b) => `
              <button class="chip" data-backdrop="${b.id}" type="button">${escapeHtml(b.label)}</button>
            `).join('')}
          </div>
          <button class="save" id="profile-save" type="button">Update room</button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfProfileSheet);
