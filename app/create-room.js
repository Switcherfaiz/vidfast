import { SwitchComponent, updateState, getState } from 'switch-framework';
import { navigate } from 'switch-framework/router';

function generateRoomLink() {
  const id = Math.random().toString(36).slice(2, 10);
  return `${window.location.origin}/meet/${id}`;
}

export class SwCreateRoomScreen extends SwitchComponent {
  static screenName = 'create-room';
  static path = '/create-room';
  static title = 'Create room';
  static tag = 'sw-create-room-screen';
  static layout = 'stack';

  onMount() {
    this.listener('#back_btn', 'click', () => navigate('index'));
    this.listener('#copy_btn', 'click', () => this.copyLink());
    this.listener('#join_btn', 'click', () => navigate('meeting'));

    const link = getState('meeting-link');
    if (!link) {
      const newLink = generateRoomLink();
      updateState('meeting-link', newLink);
    }
  }

  async copyLink() {
    const link = getState('meeting-link');
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      const btn = this.select('#copy_btn');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }
    } catch {}
  }

  render() {
    const link = getState('meeting-link') || generateRoomLink();

    return `
      <div class="wrap">
        <button id="back_btn" class="back-btn">
          <span class="switch_icon_arrow_left"></span> Back
        </button>

        <div class="content">
          <h1 class="title">Room created</h1>
          <p class="desc">Share this link with participants</p>

          <div class="link-box">
            <input type="text" class="link-input" value="${this.escapeAttr(link)}" readonly />
            <button id="copy_btn" class="copy-btn">Copy</button>
          </div>

          <button id="join_btn" class="primary-btn">Join meeting</button>
        </div>
      </div>
    `;
  }

  escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
        }

        * { box-sizing: border-box; }

        .wrap {
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .back-btn:hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .content {
          flex: 1;
          width: 100%;
          max-width: 420px;
          margin: 48px auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
        }

        .desc {
          font-size: 16px;
          color: #64748b;
          margin: 0;
        }

        .link-box {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .link-input {
          flex: 1;
          padding: 16px 20px;
          font-size: 14px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          background: #f8fafc;
          color: #475569;
          outline: none;
        }

        .copy-btn {
          padding: 16px 20px;
          background: white;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #8A5CF5;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          background: #f5f3ff;
        }

        .primary-btn {
          padding: 14px 24px;
          background: #8A5CF5;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-btn:hover {
          background: #7c4ce8;
          transform: translateY(-1px);
        }
      </style>
    `;
  }
}
