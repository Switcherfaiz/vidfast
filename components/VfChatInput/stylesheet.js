import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .input-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px 18px;
        border-top: 1px solid var(--vf-border);
        background: #fafbfc;
      }

      .input-row input {
        flex: 1;
        border: 1px solid var(--vf-border);
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 14px;
        outline: none;
        background: #fff;
      }

      .input-row input:focus {
        border-color: rgba(62, 180, 137, 0.45);
      }

      .input-row button {
        width: 42px;
        height: 42px;
        border: none;
        border-radius: 50%;
        background: var(--vf-primary);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .input-row button span { font-size: 16px; }
    </style>
  `;
}
