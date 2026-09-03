import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}

      .transcript {
        margin: 14px 24px 0;
        padding: 14px 16px;
        background: var(--vf-surface);
        border: 1px solid var(--vf-border);
        border-radius: var(--vf-radius-md);
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: 0 2px 10px rgba(15,23,42,0.04);
      }

      .wave {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 28px;
        flex-shrink: 0;
      }

      .wave span {
        width: 3px;
        border-radius: 999px;
        background: var(--vf-primary);
        opacity: 0.85;
      }

      .text {
        margin: 0;
        flex: 1;
        font-size: 14px;
        color: #334155;
        line-height: 1.45;
      }
    </style>
  `;
}
