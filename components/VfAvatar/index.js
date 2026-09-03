import { SwitchComponent, createProps, registerComponent } from 'switch-framework';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfAvatar extends SwitchComponent {
  static tag = 'vf-avatar';

  render() {
    const { src = '', name = 'U', size = 36, ring = false } = this.getProps();
    const initial = escapeHtml(String(name).charAt(0).toUpperCase());
    const px = Number(size) || 36;

    return `
      <div class="avatar${ring ? ' ring' : ''}" style="width:${px}px;height:${px}px">
        ${src
          ? `<img src="${escapeHtml(src)}" alt="${initial}" />`
          : `<span>${initial}</span>`}
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfAvatar);
