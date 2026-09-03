import { SwitchComponent, getState, registerComponent } from 'switch-framework';
import { styleSheet } from './stylesheet.js';
import { bindControls } from './functionalities.js';

export class VfVideoControls extends SwitchComponent {
  static tag = 'vf-video-controls';

  onMount() {
    bindControls(this);
  }

  render() {
    const controls = getState('call-controls') || {};
    const muted = !!controls.muted;
    const cameraOn = controls.cameraOn !== false;

    return `
      <div class="controls">
        <button class="ctrl" type="button" aria-label="Fullscreen">
          <span class="switch_icon_expand"></span>
        </button>
        <button id="vf-mute" class="ctrl${muted ? ' off' : ''}" type="button" aria-label="Mute">
          <span class="switch_icon_microphone${muted ? '_slash' : ''}"></span>
        </button>
        <button id="vf-end" class="ctrl end" type="button" aria-label="End call">
          <span class="switch_icon_phone_slash"></span>
        </button>
        <button id="vf-camera" class="ctrl${cameraOn ? '' : ' off'}" type="button" aria-label="Camera">
          <span class="switch_icon_video${cameraOn ? '' : '_slash'}"></span>
        </button>
        <button class="ctrl" type="button" aria-label="Settings">
          <span class="switch_icon_gear"></span>
        </button>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfVideoControls);
