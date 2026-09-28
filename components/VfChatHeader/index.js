import { SwitchComponent, getState, registerComponent, onState } from 'switch-framework';
import { escapeHtml } from '../../app/lib/html.js';
import { styleSheet } from './stylesheet.js';

export class VfChatHeader extends SwitchComponent {
  static tag = 'vf-chat-header';

  onMount() {
    onState('active-call', () => this._paint());
    this._paint();
  }

  _paint() {
    const call = getState('active-call') || {};
    const title = this.select('.name');
    const sub = this.select('.sub');
    if (title) title.textContent = 'Group Chat';
    if (sub) {
      const count = (call.participants || []).filter((p) => p.role !== 'invite').length;
      sub.textContent = count ? `${count} in the room · evaporates on leave` : 'Ephemeral chat';
    }
  }

  render() {
    const call = getState('active-call') || {};
    const count = (call.participants || []).filter((p) => p.role !== 'invite').length;
    return `
      <div class="head">
        <div>
          <div class="name">Group Chat</div>
          <div class="sub">${escapeHtml(count ? `${count} in the room · evaporates on leave` : 'Ephemeral chat')}</div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatHeader);
