import { SwitchComponent, getState, createProps, registerComponent } from 'switch-framework';
import '../VfBadge/index.js';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfTranscriptBar extends SwitchComponent {
  static tag = 'vf-transcript-bar';
  static { this.useState('active-call'); }

  render() {
    const call = getState('active-call') || {};
    const text = call.transcript || "Thanks for sending all those completed transcripts through – we've been really happy with the quality and turnaround time.";
    const isNew = call.transcriptNew !== false;

    return `
      <div class="transcript">
        <div class="wave" aria-hidden="true">
          ${Array.from({ length: 24 }).map((_, i) => `<span style="height:${12 + (i % 5) * 4}px"></span>`).join('')}
        </div>
        <p class="text">${escapeHtml(text)}</p>
        ${isNew ? `<vf-badge data="${createProps({ label: 'New', tone: 'new' })}"></vf-badge>` : ''}
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfTranscriptBar);
