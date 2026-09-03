import { SwitchComponent, registerComponent } from 'switch-framework';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfButton extends SwitchComponent {
  static tag = 'vf-button';

  render() {
    const {
      label = 'Button',
      variant = 'primary',
      icon = '',
      id = '',
      type = 'button'
    } = this.getProps();

    return `
      <button
        ${id ? `id="${escapeHtml(id)}"` : ''}
        class="btn variant-${escapeHtml(variant)}"
        type="${escapeHtml(type)}"
      >
        ${icon ? `<span class="${escapeHtml(icon)}"></span>` : ''}
        <span>${escapeHtml(label)}</span>
      </button>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfButton);
