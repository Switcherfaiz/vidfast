import { updateState } from 'switch-framework';

export function bindSidebar(host) {
  host.queryAll('.nav-item').forEach((btn) => {
    host.listener(btn, 'click', () => {
      updateState('sidebar-active', btn.dataset.nav || 'calls');
    });
  });
}
