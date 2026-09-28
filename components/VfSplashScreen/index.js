import { SwitchComponent, registerComponent } from 'switch-framework';
import { styleSheet } from './stylesheet.js';
import { splashMarkup } from './functionalities.js';

export class VfSplashScreen extends SwitchComponent {
  static tag = 'vf-splashscreen';

  render() {
    return splashMarkup();
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfSplashScreen);
