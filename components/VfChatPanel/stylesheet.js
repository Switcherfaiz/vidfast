import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}

      .chat-panel {
        width: 340px;
        min-width: 300px;
        background: #f8fafc;
        border-left: 1px solid var(--vf-border);
        display: flex;
        flex-direction: column;
        min-height: 0;
      }

      .head {
        padding: 18px 20px 0;
      }

      .head h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
      }

      .messages {
        flex: 1;
        overflow: auto;
        padding: 16px 16px 8px;
        min-height: 0;
      }

      .typing {
        font-size: 12px;
        color: #94a3b8;
        padding: 4px 4px 8px;
      }

      .participants {
        flex: 1;
        overflow: auto;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .person {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        background: #fff;
        border-radius: 12px;
        border: 1px solid var(--vf-border);
      }

      .person .meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .person strong {
        font-size: 14px;
      }

      .person span {
        font-size: 12px;
        color: #94a3b8;
      }
    </style>
  `;
}
