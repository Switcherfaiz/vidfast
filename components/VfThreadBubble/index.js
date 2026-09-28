import { SwitchComponent, createProps, registerComponent } from 'switch-framework';
import '../VfAvatar/index.js';
import { escapeHtml } from '../../app/lib/html.js';
import { icon } from '../../app/lib/icons.js';
import { styleSheet } from './stylesheet.js';

function formatTime(at) {
  if (at == null || at === '') return '';
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export class VfThreadBubble extends SwitchComponent {
  static tag = 'vf-thread-bubble';

  render() {
    const t = this.getProps() || {};
    const side = t.side || t.from || (t.outgoing ? 'me' : 'them');
    this.classList.toggle('is-me', side === 'me');

    if (t.type === 'system') {
      return `
        <div class="row system">
          <span class="sys-ic">${icon('phone', 14)}</span>
          <span>${escapeHtml(t.text || '')}</span>
        </div>
      `;
    }

    return `
      <div class="row ${side}">
        ${side === 'them' ? `<vf-avatar data="${createProps({ src: t.avatar, name: t.authorName || 'U', size: 32 })}"></vf-avatar>` : ''}
        <div class="col">
          <div class="author">${escapeHtml(side === 'me' ? 'You' : (t.authorName || ''))}</div>
          <div class="bubble ${side}">${escapeHtml(t.text || '')}</div>
          ${t.at ? `<div class="time">${escapeHtml(formatTime(t.at))}</div>` : ''}
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

export function threadBubbleTag(item) {
  const side = item.side || item.from || (item.outgoing ? 'me' : 'them');
  return `<vf-thread-bubble data="${createProps({
    side,
    from: side,
    outgoing: side === 'me',
    text: item.text || '',
    at: item.at,
    avatar: item.avatar || '',
    authorName: item.authorName || '',
    type: item.type || 'message'
  })}"></vf-thread-bubble>`;
}

registerComponent(VfThreadBubble);
