import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .msg {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        margin-bottom: 14px;
      }

      .msg.outgoing {
        flex-direction: row-reverse;
      }

      .bubble-wrap {
        max-width: 78%;
      }

      .author {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        margin-bottom: 4px;
      }

      .msg.outgoing .author {
        text-align: right;
      }

      .bubble {
        padding: 10px 14px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid var(--vf-border);
        font-size: 14px;
        line-height: 1.45;
        color: #334155;
      }

      .msg.outgoing .bubble {
        background: var(--vf-outgoing);
        border-color: transparent;
      }

      .msg.system {
        justify-content: center;
        align-items: center;
        gap: 8px;
        margin: 18px 0;
        padding: 8px 14px;
        border-radius: 999px;
        background: rgba(62, 180, 137, 0.12);
        color: var(--vf-primary-dark);
        font-size: 13px;
        font-weight: 600;
      }

      .msg.system span:first-child { font-size: 14px; }
    </style>
  `;
}
