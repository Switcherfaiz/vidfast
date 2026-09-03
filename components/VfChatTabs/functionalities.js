import { updateState } from 'switch-framework';

export function bindChatTabs(host) {
  host.queryAll('.tab').forEach((btn) => {
    host.listener(btn, 'click', () => {
      updateState('chat-tab', btn.dataset.tab || 'messages');
    });
  });
}
