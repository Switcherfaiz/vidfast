import { Modal, getState, registerComponent, onState } from 'switch-framework';
import { escapeHtml } from '../../app/lib/html.js';
import { icon } from '../../app/lib/icons.js';
import { styleSheet } from './stylesheet.js';
import { bindPasswordSheet } from './functionalities.js';
import { cancelMeetingPassword } from '../../app/lib/passwordPrompt.js';

export class VfPasswordSheet extends Modal {
  static tag = 'vf-password-sheet';
  static visibleState = 'password-prompt-open';
  static animationType = 'fade';
  static presentationStyle = 'centered';
  static interceptBack = true;
  static transparent = false;

  onMount() {
    bindPasswordSheet(this);
    onState('password-prompt-open', (open) => {
      if (open === true) this._resetForm();
    });
    onState('password-prompt-reason', () => this.rerender());
  }

  onRequestClose() {
    cancelMeetingPassword();
  }

  _resetForm() {
    queueMicrotask(() => {
      const input = this.select('#pw-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      const err = this.select('#pw-error');
      if (err) err.textContent = '';
      const btn = this.select('#pw-submit');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Join room';
      }
    });
  }

  render() {
    const reason = getState('password-prompt-reason') || 'This room is locked.';

    return `
      <div class="sheet" role="dialog" aria-label="Room password">
        <header>
          <h2>Room password</h2>
          <button class="x" id="pw-close" type="button" aria-label="Close">${icon('close')}</button>
        </header>
        <p class="hint" id="pw-reason">${escapeHtml(reason)}</p>
        <label>
          Password
          <input id="pw-input" type="password" maxlength="64" placeholder="Enter room password" autocomplete="current-password" />
        </label>
        <p class="err" id="pw-error"></p>
        <div class="row">
          <button class="btn ghost" id="pw-cancel" type="button">Cancel</button>
          <button class="btn primary" id="pw-submit" type="button">Join room</button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfPasswordSheet);
