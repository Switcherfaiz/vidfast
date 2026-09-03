import { SwitchComponent, getState, createProps, registerComponent } from 'switch-framework';
import '../VfAvatar/index.js';
import { styleSheet } from './stylesheet.js';
import { bindSidebar } from './functionalities.js';

export class VfSidebar extends SwitchComponent {
  static tag = 'vf-sidebar';

  onMount() {
    bindSidebar(this);
  }

  render() {
    const user = getState('user') || {};
    const active = getState('sidebar-active') || 'calls';

    const items = [
      { id: 'history', icon: 'switch_icon_clock' },
      { id: 'schedule', icon: 'switch_icon_calendar' },
      { id: 'views', icon: 'switch_icon_eye' },
      { id: 'contacts', icon: 'switch_icon_users' },
      { id: 'analytics', icon: 'switch_icon_chart_simple' },
      { id: 'calls', icon: 'switch_icon_video' }
    ];

    return `
      <aside class="sidebar">
        <div class="logo">
          <img src="/assets/logo.svg" alt="VidFast" />
        </div>
        <nav class="nav">
          ${items.map((item) => `
            <button
              class="nav-item${active === item.id ? ' active' : ''}"
              data-nav="${item.id}"
              type="button"
              aria-label="${item.id}"
            >
              <span class="${item.icon}"></span>
            </button>
          `).join('')}
        </nav>
        <div class="profile">
          <vf-avatar data="${createProps({ src: user.avatar, name: user.name, size: 34 })}"></vf-avatar>
        </div>
      </aside>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfSidebar);
