import { SwitchComponent, getState, registerComponent, onState } from 'switch-framework';
import { escapeHtml } from '../../app/lib/html.js';
import { styleSheet } from './stylesheet.js';
import { bindStageGrid, paintStageGrid, attachAllRemotes } from './functionalities.js';

export class VfStageGrid extends SwitchComponent {
  static tag = 'vf-stage-grid';

  onMount() {
    bindStageGrid(this);
    onState('active-call', () => this.repaint());
    onState('user', () => this.repaint());
    onState('call-controls', () => this.repaint());
    onState('focused-peer', () => this.repaint());
    onState('in-room', () => this.repaint());
    this._resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(this._resizeFrame);
      this._resizeFrame = requestAnimationFrame(() => this.repaint());
    });
    this._resizeObserver.observe(this);
    this.repaint();
  }

  onDestroy() {
    if (typeof this._gridOff === 'function') this._gridOff();
    this._resizeObserver?.disconnect();
    cancelAnimationFrame(this._resizeFrame);
  }

  repaint() {
    paintStageGrid(this);
  }

  attachAllRemotes() {
    attachAllRemotes(this);
  }

  render() {
    const user = getState('user') || {};

    return `
      <div id="tile-grid" class="tiles" data-count="1">
        <div class="tile self" id="local-tile">
          <video id="local-video" autoplay playsinline muted></video>
          <div class="cam-off" id="cam-off">${escapeHtml((user.name || 'You').charAt(0))}</div>
          <span class="tag" id="self-tag">You</span>
        </div>
      </div>
      <nav class="pages" id="grid-pages" hidden aria-label="Participant pages">
        <button id="page-prev" type="button" aria-label="Previous participants">‹</button>
        <span id="page-label">1 / 1</span>
        <button id="page-next" type="button" aria-label="Next participants">›</button>
      </nav>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfStageGrid);
