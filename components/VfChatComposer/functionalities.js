import { getState } from 'switch-framework';
import { signaling } from '../../app/services/index.js';

export function bindChatComposer(host) {
  const resize = () => {
    const input = host.select('#vf-chat-input');
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  };

  const send = () => {
    if (!getState('in-room')) {
      alert('Join the meeting first to send messages.');
      return;
    }
    const input = host.select('#vf-chat-input');
    const text = String(input?.value || '').trim();
    if (!text) return;
    if (!signaling.sendRoomChat(text)) return;
    input.value = '';
    resize();
  };

  host.listener('#vf-chat-send', 'click', send);
  host.listener('#vf-chat-input', 'keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  host.listener('#vf-chat-input', 'input', resize);
}
