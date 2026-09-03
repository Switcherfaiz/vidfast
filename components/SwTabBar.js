import { SwitchComponent } from 'switch-framework';
import { navigate, useRouteChangesSubscriber, getActiveRoute } from 'switch-framework/router';

export class SwTabBar extends SwitchComponent {
  static tag = 'sw-tab-bar';

  connected() {
    this.updateActive();
    this._unsub = useRouteChangesSubscriber(() => this.updateActive());

    this.shadowRoot.addEventListener('click', (e) => {
      const btn = e.target?.closest?.('button[data-route]');
      if (!btn) return;
      const route = btn.getAttribute('data-route');
      navigate(route);
    });
  }

  disconnected() {
    if (this._unsub) this._unsub();
  }

  getTabs() {
    const layout = globalStates?.getState ? globalStates.getState('tabsLayout') : null;
    const tabs = Array.isArray(layout?.tabs) ? layout.tabs : [];
    return tabs;
  }

  updateActive() {
    const activeRoute = getActiveRoute();
    const tabs = this.getTabs();

    tabs.forEach((t) => {
      const el = this.shadowRoot?.getElementById?.(`tab-${t.name}`);
      if (!el) return;
      const matchList = Array.isArray(t?.match) ? t.match : [t.name].filter(Boolean);
      const isActive = matchList.some((m) => String(activeRoute || '').startsWith(String(m)) || String(activeRoute || '') === String(m));
      el.classList.toggle('active', isActive);
    });
  }

  getIcon(name) {
    const map = {
      home: `<span class='switch_icon_house'></span>`,
      compass: `<span class='switch_icon_compass'></span>`,
      settings: `<span class='switch_icon_gear'></span>`
    };
    return map[name] || map.home;
  }

  render() {
    const tabs = this.getTabs();

    return `
      <nav class="bar" aria-label="Bottom tabs">
        ${tabs.map((t) => {
          const route = t.initialRoute || (t.path ? t.path.replace(/^\//, '') : t.name);
          return `
          <button class="tab" id="tab-${t.name}" data-route="${route || t.name}" type="button">
            <span class="icon">${this.getIcon(t.icon)}</span>
            <span class="label">${t.title || t.name}</span>
          </button>
        `;
        }).join('')}
      </nav>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
          background: transparent;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .bar {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid var(--border_color, #e5e5e5);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: saturate(180%) blur(10px);
        }

        :root[data-theme="dark"] .bar {
          background: rgba(11, 15, 20, 0.95);
          border-top-color: rgba(255, 255, 255, 0.1);
        }

        .tab {
          appearance: none;
          border: none;
          background: transparent;
          border-radius: 20px;
          padding: 12px 14px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--sub_text, #666);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .tab:active {
          transform: scale(0.95);
        }

        .tab.active {
          background: rgba(0, 0, 0, 0.06);
          color: var(--main_text, #000);
        }

        :root[data-theme="dark"] .tab.active {
          background: rgba(255, 255, 255, 0.1);
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          line-height: 1;
        }

        .label {
          display: block;
          text-align: center;
          font-size: 11px;
          font-weight: 600;
        }
      </style>
    `;
  }
}
