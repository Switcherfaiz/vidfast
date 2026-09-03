import { SwitchComponent, registerComponent } from 'switch-framework';
import { styleSheet } from './stylesheet.js';
import { bindChatInput } from './functionalities.js';

export class VfChatInput extends SwitchComponent {
  static tag = 'vf-chat-input';

  onMount() {
    bindChatInput(this);
  }

  render() {
    return `
      <div class="input-row">
        <input id="vf-chat-input" type="text" placeholder="Write your message..." autocomplete="off" />
        <button id="vf-chat-send" type="button" aria-label="Send">
          <span class="switch_icon_paper_plane"></span>
        </button>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatInput);
