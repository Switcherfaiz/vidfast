import { SwitchComponent } from 'switch-framework';
import { vfTheme } from '../assets/styles/tokens.js';

export class VfNotFoundScreen extends SwitchComponent {
  static screenName = '+not-found';
  static path = '*';
  static tag = 'vf-not-found-screen';
  static layout = 'stack';

  render() {
    return `
      <div class="wrap vf-theme">
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        ${vfTheme}
        .wrap { min-height: 100vh; display: grid; place-content: center; text-align: center; }
      </style>
    `;
  }
}
