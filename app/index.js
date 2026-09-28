import { SwitchComponent, redirect, replace } from 'switch-framework';
import { checkIntro } from '../hooks/checkIntro.js';
import { hydrateGuest } from './lib/session.js';

export class VfIndexScreen extends SwitchComponent {
  static screenName = 'index';
  static path = '/';
  static title = 'VidFast';
  static tag = 'vf-index-screen';

  _loading = true;

  async onMount() {
    hydrateGuest();
    const result = await checkIntro();
    this._loading = false;
    this.rerender();

    if (result?.shouldShowIntro) return redirect('intro');
    replace('join', { __url: '/', __lockHistory: true });
  }

  render() {
    return `
      <div class="wrap">
        <div class="loader"></div>
        <div class="t">${this._loading ? 'Starting...' : 'Redirecting...'}</div>
      </div>
    `;
  }

  styleSheet() {
    return `
      :host { display: block; width: 100%; font-family: var(--font, 'DM Sans', system-ui, sans-serif); }
      .wrap { min-height: 100dvh; display: flex; flex-direction: column; gap: 10px; align-items: center; justify-content: center; background: #07131c; }
      .t { font-weight: 800; color: #e2e8f0; }
      .loader { height: 34px; width: 34px; border-radius: 999px; border: 3px solid #163042; border-top-color: #14b8a6; animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;
  }
}
