import { SwitchComponent, updateState, getState } from 'switch-framework';
import { navigate } from 'switch-framework/router';

export class SwJoinScreen extends SwitchComponent {
  static screenName = 'join';
  static path = '/join';
  static title = 'Join meeting';
  static tag = 'sw-join-screen';
  static layout = 'stack';

  onMount() {
    this.listener('#back_btn', 'click', () => navigate('index'));
    this.listener('#join_btn', 'click', () => this.handleJoin());
    this.listener('#link_input', 'input', (e) => updateState('meeting-link', e.target.value || ''));
  }

  handleJoin() {
    const link = getState('meeting-link')?.trim();
    if (!link) return;
    updateState('meeting-link', link);
    navigate('meeting');
  }

  render() {
    const link = getState('meeting-link') || '';

    return `
      <div class="wrap">
        <button id="back_btn" class="back-btn">
          <span class="switch_icon_arrow_left"></span> Back
        </button>

        <div class="content">
          <h1 class="title">Join a meeting</h1>
          <p class="desc">Paste the meeting link below</p>

          <input
            id="link_input"
            type="text"
            class="link-input"
            placeholder="https://vidfast.app/meet/abc123"
            value="${this.escapeAttr(link)}"
          />

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

        .link-input {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          background: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .link-input:focus {
          border-color: #8A5CF5;
          box-shadow: 0 0 0 3px rgba(138, 92, 245, 0.15);
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
