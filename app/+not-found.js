import { SwitchComponent } from 'switch-framework';
import { navigate } from 'switch-framework/router';

export class VfNotFoundScreen extends SwitchComponent {
  static screenName = '+not-found';
  static path = '*';
  static tag = 'vf-not-found-screen';
  static layout = 'stack';

  onMount() {
    this.listener('#go-home', 'click', () => navigate('join'));
  }

  render() {
    return `
      <div class="wrap">
        <h1>404</h1>
        <p>That page is not in this meeting.</p>
        <button id="go-home" type="button">Back to join</button>
      </div>
    `;
  }

  styleSheet() {
    return `
      :host { display: block; min-height: 100dvh; font-family: var(--font, 'DM Sans', system-ui, sans-serif); background: #eef2f6; }
      .wrap { min-height: 100dvh; display: grid; place-content: center; justify-items: center; gap: 10px; text-align: center; }
      h1 { margin: 0; font-size: 48px; }
      p { margin: 0; color: #64748b; font-weight: 600; }
      button { border: none; background: #14b8a6; color: #fff; border-radius: 999px; padding: 12px 18px; font-weight: 800; cursor: pointer; }
    `;
  }
}
