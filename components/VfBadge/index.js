import { SwitchComponent, registerComponent } from 'switch-framework';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfBadge extends SwitchComponent {
  static tag = 'vf-badge';

  render() {
    const { label = '', tone = 'neutral' } = this.getProps();
    return `<span class="badge tone-${escapeHtml(tone)}">${escapeHtml(label)}</span>`;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfBadge);
