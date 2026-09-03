import { SwitchComponent, getState, registerComponent } from 'switch-framework';
import { styleSheet } from './stylesheet.js';
import { bindVolume } from './functionalities.js';

export class VfVolumeSlider extends SwitchComponent {
  static tag = 'vf-volume-slider';

  onMount() {
    bindVolume(this);
  }

  render() {
    const controls = getState('call-controls') || {};
    const volume = Number(controls.volume ?? 70);

    return `
      <div class="volume">
        <span class="switch_icon_volume_high"></span>
        <input
          id="vf-volume"
          class="slider"
          type="range"
          min="0"
          max="100"
          value="${volume}"
          orient="vertical"
          aria-label="Volume"
        />
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfVolumeSlider);
