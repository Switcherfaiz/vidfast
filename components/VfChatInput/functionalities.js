import { getState, updateState } from 'switch-framework';
import { sendCallMessage } from '../../app/api.js';

export function bindChatInput(host) {
  const send = async () => {
    const input = host.query('#vf-chat-input');
    const text = String(input?.value || '').trim();
    if (!text) return;

    const call = getState('active-call');
    if (!call?.id) return;

    input.value = '';
    const optimistic = {
      id: `tmp-${Date.now()}`,
      authorName: 'You',
      avatar: getState('user')?.avatar || '',
      text,
      type: 'message',
      outgoing: true,
      at: Date.now()
    };
    const prev = getState('call-messages') || [];
    updateState('call-messages', [...prev, optimistic]);

    try {
      const { message } = await sendCallMessage(call.id, text);
      updateState('call-messages', [...prev, message]);
    } catch (_) {}
  };

  host.listener('#vf-chat-send', 'click', send);
  host.listener('#vf-chat-input', 'keydown', (e) => {
    if (e.key === 'Enter') send();
  });
}
