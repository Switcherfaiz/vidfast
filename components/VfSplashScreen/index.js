import { SwitchComponent, registerComponent } from 'switch-framework';
import { styleSheet } from './stylesheet.js';

export class VfSplashScreen extends SwitchComponent {
  static tag = 'vf-splashscreen';

  render() {
    return `
      <div class="wrap">
        <img src="/assets/logo.svg" alt="VidFast" class="logo" />
        <div class="title">VidFast</div>
        <div class="sub">Connecting…</div>
        <div class="loader"></div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfSplashScreen);
