import { SwitchComponent, registerComponent } from 'switch-framework';
import { icon } from '../../app/lib/icons.js';
import { styleSheet } from './stylesheet.js';
import { bindChatComposer } from './functionalities.js';

export class VfChatComposer extends SwitchComponent {
  static tag = 'vf-chat-composer';

  onMount() {
    bindChatComposer(this);
  }

  render() {
    return `
      <div class="composer">
        <div class="box">
          <textarea id="vf-chat-input" class="reply" rows="1" placeholder="Write your message..." autocomplete="off"></textarea>
          <button id="vf-chat-send" class="send" type="button" aria-label="Send">${icon('send')}</button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfChatComposer);
