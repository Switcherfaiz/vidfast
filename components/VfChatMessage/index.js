import { SwitchComponent, createProps, registerComponent } from 'switch-framework';
import '../VfAvatar/index.js';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfChatMessage extends SwitchComponent {
  static tag = 'vf-chat-message';

  render() {
    const {
      authorName = '',
      avatar = '',
      text = '',
      type = 'message',
      outgoing = false
    } = this.getProps();

    if (type === 'system') {
      return `
        <div class="msg system">
          <span class="switch_icon_phone"></span>
          <span>${escapeHtml(text)}</span>
        </div>
      `;
    }

    return `
      <div class="msg${outgoing ? ' outgoing' : ''}">
        ${!outgoing ? `<vf-avatar data="${createProps({ src: avatar, name: authorName, size: 32 })}"></vf-avatar>` : ''}
        <div class="bubble-wrap">
          <div class="author">${escapeHtml(outgoing ? 'You' : authorName)}</div>
          <div class="bubble">${escapeHtml(text)}</div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatMessage);
