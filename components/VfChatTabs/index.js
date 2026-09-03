import { SwitchComponent, getState, registerComponent } from 'switch-framework';
import { styleSheet } from './stylesheet.js';
import { bindChatTabs } from './functionalities.js';

export class VfChatTabs extends SwitchComponent {
  static tag = 'vf-chat-tabs';
  static { this.useState('chat-tab'); }

  onMount() {
    bindChatTabs(this);
  }

  render() {
    const tab = getState('chat-tab') || 'messages';

    return `
      <div class="tabs">
        <button class="tab${tab === 'messages' ? ' active' : ''}" data-tab="messages" type="button">Messages</button>
        <button class="tab${tab === 'participants' ? ' active' : ''}" data-tab="participants" type="button">Participants</button>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatTabs);
