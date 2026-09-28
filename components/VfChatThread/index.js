import { FlatList, onState, registerComponent, getState } from 'switch-framework';
import '../VfThreadBubble/index.js';
import { threadBubbleTag } from '../VfThreadBubble/index.js';
import { icon } from '../../app/lib/icons.js';
import { escapeHtml } from '../../app/lib/html.js';
import { signaling } from '../../app/services/index.js';

export class VfChatThread extends FlatList {
  static tag = 'vf-chat-thread';
  static dataState = 'call-messages';
  static loadingState = 'call-thread-loading';
  static layout = 'stack';
  static virtualized = true;
  static initialNumToRender = 24;
  static maxToRenderPerBatch = 12;
  static windowSize = 10;
  static estimatedItemSize = 72;
  static removeClippedSubviews = true;
  static showsVerticalScrollIndicator = true;

  onMount() {
    super.onMount();
    onState('call-messages', () => {
      if (this._nearBottom()) queueMicrotask(() => this.scrollToEnd({ animated: false }));
    });
    onState('chat-open', (open) => {
      if (open === true) queueMicrotask(() => this.scrollToEnd({ animated: false }));
    });
    onState('in-room', () => {
      queueMicrotask(() => {
        this._patchData(getState('call-messages') || []);
        this.scrollToEnd({ animated: false });
      });
    });
    const off = signaling.onSignal((msg) => {
      if (msg.type === 'chat' && msg.message) {
        signaling.appendCallMessage(msg.message);
        if (this._nearBottom()) queueMicrotask(() => this.scrollToEnd({ animated: false }));
      }
    });
    this.addOnDestroy?.(off);
    this.listener('#jump-latest', 'click', (e) => this._jumpLatest(e));
    queueMicrotask(() => this.scrollToEnd({ animated: false }));
  }

  onScroll(event) {
    super.onScroll(event);
    this._syncJump();
  }

  onUpdate() {
    super.onUpdate?.();
    this._syncJump();
  }

  _nearBottom() {
    const host = this._portRef;
    if (!host) return true;
    return host.scrollHeight - host.scrollTop - host.clientHeight < 80;
  }

  _jumpLatest(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    this.scrollToEnd({ animated: true });
    requestAnimationFrame(() => this._syncJump());
  }

  _syncJump() {
    const btn = this.select('#jump-latest');
    const host = this._portRef;
    if (!btn || !host) return;
    const canScroll = host.scrollHeight - host.clientHeight > 32;
    btn.classList.toggle('show', canScroll && !this._nearBottom());
  }

  keyExtractor(item, index) {
    return String(item?.id ?? item?.at ?? `msg-${index}`);
  }

  renderSeparator() {
    return '';
  }

  renderEmpty() {
    if (!getState('in-room')) {
      return `
        <div class="placeholder">
          <div class="placeholder-icon">${icon('chat', 28)}</div>
          <h2>Join to chat</h2>
          <p>Messages appear here once you join the live call.</p>
        </div>
      `;
    }
    if (getState('call-thread-loading')) {
      return `<div class="placeholder"><div class="loader"></div><p>Loading messages…</p></div>`;
    }
    return `
      <div class="placeholder">
        <div class="placeholder-icon">${icon('chat', 28)}</div>
        <h2>Start the chat</h2>
        <p>Say hi. Chat lives in this room only, then disappears.</p>
      </div>
    `;
  }

  renderItem({ item }) {
    return threadBubbleTag(item);
  }

  render() {
    return `
      <div class="wrap">
        ${super.render()}
        <button class="jump" id="jump-latest" type="button" aria-label="Jump to latest">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          Latest
        </button>
      </div>
    `;
  }

  styleSheet() {
    return `${super.styleSheet()}<style>
      :host {
        display: flex;
        flex: 1;
        min-height: 0;
        font-family: var(--font, 'DM Sans', system-ui, sans-serif);
      }
      .wrap {
        position: relative;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .flat-list-wrapper, .flat-list-container { height: 100%; min-height: 0; }
      .flat-list-content { gap: 10px; padding: 14px 16px 12px; min-height: 100%; }
      .jump {
        display: none;
        position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%);
        align-items: center; gap: 4px;
        border: none; border-radius: 999px;
        background: #fff;
        color: #0f172a;
        box-shadow: 0 6px 20px rgba(0,0,0,0.14);
        font-size: 12px; font-weight: 800;
        padding: 8px 12px; cursor: pointer; z-index: 5;
      }
      .jump.show { display: inline-flex; }
      .placeholder {
        margin: auto; display: flex; flex-direction: column; align-items: center;
        justify-content: center; text-align: center; gap: 8px;
        color: #94a3b8; padding: 32px; min-height: 28vh;
      }
      .placeholder h2 { color: #0f172a; font-size: 18px; font-weight: 800; }
      .placeholder-icon {
        width: 72px; height: 72px; border-radius: 50%; background: #eef2f6;
        display: flex; align-items: center; justify-content: center; color: #94a3b8;
      }
      .loader {
        width: 28px; height: 28px; border-radius: 50%;
        border: 3px solid #e2e8f0; border-top-color: #14b8a6;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>`;
  }
}

registerComponent(VfChatThread);
