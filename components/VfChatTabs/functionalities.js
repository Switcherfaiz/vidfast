import { updateState } from 'switch-framework';

export function bindChatTabs(host) {
  host.listener('.tab', 'click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    updateState('chat-tab', btn.dataset.tab || 'messages');
  });
}
