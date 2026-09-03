import { SwitchComponent, createProps, registerComponent } from 'switch-framework';
import '../VfAvatar/index.js';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfParticipantTile extends SwitchComponent {
  static tag = 'vf-participant-tile';

  render() {
    const {
      name = '',
      avatar = '',
      muted = false,
      videoPoster = '',
      invite = false
    } = this.getProps();

    if (invite) {
      return `
        <div class="tile invite">
          <span class="switch_icon_plus"></span>
        </div>
      `;
    }

    return `
      <div class="tile">
        <div class="video" style="background-image:url('${escapeHtml(videoPoster || avatar)}')"></div>
        ${muted ? '<span class="mute switch_icon_microphone_slash"></span>' : ''}
        <vf-avatar data="${createProps({ src: avatar, name, size: 28 })}"></vf-avatar>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfParticipantTile);
