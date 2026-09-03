import { SwitchComponent, getState, createProps, registerComponent, useShared } from 'switch-framework';
import '../VfChatTabs/index.js';
import '../VfChatMessage/index.js';
import '../VfChatInput/index.js';
import '../VfAvatar/index.js';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfChatPanel extends SwitchComponent {
  static tag = 'vf-chat-panel';
  static { this.useState('chat-tab'); this.useState('call-messages'); this.useState('active-call'); }

  effects() {
    useShared('call-messages', []);
    useShared('chat-tab', 'messages');
  }

  renderParticipants() {
    const call = getState('active-call') || {};
    const participants = (call.participants || []).filter((p) => p.role !== 'invite');

    return `
      <div class="participants">
        ${participants.map((p) => `
          <div class="person">
            <vf-avatar data="${createProps({ src: p.avatar, name: p.name, size: 36 })}"></vf-avatar>
            <div class="meta">
              <strong>${escapeHtml(p.name)}</strong>
              <span>${p.absent ? 'Absent' : p.muted ? 'Muted' : 'Connected'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderMessages() {
    const messages = getState('call-messages') || [];
    const call = getState('active-call') || {};
    const typing = call.typingUser;

    return `
      <div class="messages">
        ${messages.map((m) => `
          <vf-chat-message data="${createProps({
            authorName: m.authorName,
            avatar: m.avatar,
            text: m.text,
            type: m.type,
            outgoing: m.outgoing
          })}"></vf-chat-message>
        `).join('')}
        ${typing ? `<div class="typing">${escapeHtml(typing)} is typing…</div>` : ''}
      </div>
      <vf-chat-input></vf-chat-input>
    `;
  }

  render() {
    const tab = getState('chat-tab') || 'messages';

    return `
      <aside class="chat-panel">
        <div class="head">
          <h2>Group Chat</h2>
        </div>
        <vf-chat-tabs></vf-chat-tabs>
        ${tab === 'participants' ? this.renderParticipants() : this.renderMessages()}
      </aside>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatPanel);
