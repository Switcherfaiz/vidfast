import { SwitchComponent, getState, registerComponent, onState } from 'switch-framework';
import { styleSheet } from './stylesheet.js';
import { bindChatTabs } from './functionalities.js';

export class VfChatTabs extends SwitchComponent {
  static tag = 'vf-chat-tabs';

  onMount() {
    bindChatTabs(this);
    onState('chat-tab', (tab) => this._paint(tab || 'messages'));
    onState('active-call', () => this._paint(getState('chat-tab') || 'messages'));
    onState('in-room', () => this._paint(getState('chat-tab') || 'messages'));
    this._paint(getState('chat-tab') || 'messages');
  }

  _paint(tab) {
    this.selectAll('.tab').forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tab));
    const call = getState('active-call') || {};
    const count = (call.participants || []).length;
    const people = this.select('[data-tab="participants"]');
    if (people) people.textContent = count ? `Participants (${count})` : 'Participants';
  }

  render() {
    return `
      <div class="tabs">
        <button class="tab active" data-tab="messages" type="button">Messages</button>
        <button class="tab" data-tab="participants" type="button">Participants</button>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatTabs);
