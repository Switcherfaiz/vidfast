import { SwitchComponent, getState, registerComponent, onState } from 'switch-framework';
import '../VfChatHeader/index.js';
import '../VfChatTabs/index.js';
import '../VfChatThread/index.js';
import '../VfChatComposer/index.js';
import { escapeHtml } from '../../app/lib/html.js';
import { styleSheet } from './stylesheet.js';
import { bindChatPanel } from './functionalities.js';
import { onRoomEvent } from '../../app/lib/roomEvents.js';

export class VfChatPanel extends SwitchComponent {
  static tag = 'vf-chat-panel';

  onMount() {
    bindChatPanel(this);
    onState('chat-tab', (tab) => this._paintTab(tab));
    onState('active-call', () => this._paintPeople());
    onState('user', () => this._paintPeople());
    onState('in-room', () => this._paintPeople());
    onState('call-controls', () => this._paintPeople());
    this._roomOff = onRoomEvent('peers-changed', () => this._paintPeople());
    this._paintTab(getState('chat-tab') || 'messages');
    this._paintPeople();
  }

  onDestroy() {
    if (typeof this._roomOff === 'function') this._roomOff();
  }

  _paintTab(tab) {
    const messages = tab !== 'participants';
    const thread = this.select('#msg-pane');
    const people = this.select('#people-pane');
    if (thread) thread.hidden = !messages;
    if (people) people.hidden = messages;
  }

  _paintPeople() {
    const pane = this.select('#people-list');
    if (!pane) return;
    const call = getState('active-call') || {};
    const user = getState('user') || {};
    const live = !!getState('in-room');
    const isHost = call.hostId && call.hostId === user.id;
    let participants = (call.participants || []).filter((p) => p && p.role !== 'invite');

    if (!participants.length) {
      const controls = getState('call-controls') || {};
      participants = [{
        ...user,
        isSelf: true,
        role: 'You',
        muted: !!controls.muted,
        cameraOn: controls.cameraOn !== false
      }];
    }

    if (!participants.length) {
      pane.innerHTML = `<p class="empty-note">${live ? 'No one here yet.' : 'Join the call to see everyone in the room.'}</p>`;
      return;
    }

    pane.innerHTML = participants.map((p) => `
      <div class="person">
        <img src="${escapeHtml(p.avatar || '')}" alt="" />
        <div class="meta">
          <strong>${escapeHtml(p.name || 'Guest')}</strong>
          <span>${p.isSelf ? (live ? 'You' : 'You · not joined yet') : p.role === 'Host' ? 'Host' : p.muted ? 'Muted' : p.cameraOn === false ? 'Camera off' : 'In the room'}</span>
        </div>
        ${isHost && live && !p.isSelf ? `<button class="kick" data-kick="${escapeHtml(p.id)}" type="button">Kick</button>` : ''}
        ${live && !p.isSelf ? `<button class="soft" data-soft-mute="${escapeHtml(p.id)}" type="button">Mute for me</button>` : ''}
      </div>
    `).join('');
  }

  render() {
    return `
      <aside class="chat-panel">
        <vf-chat-header></vf-chat-header>
        <vf-chat-tabs></vf-chat-tabs>
        <div id="msg-pane" class="pane">
          <vf-chat-thread></vf-chat-thread>
          <vf-chat-composer></vf-chat-composer>
        </div>
        <div id="people-pane" class="pane" hidden>
          <div class="participants" id="people-list"></div>
        </div>
      </aside>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatPanel);
