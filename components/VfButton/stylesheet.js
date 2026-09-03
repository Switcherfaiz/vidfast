import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease;
      }
      .btn:hover { transform: translateY(-1px); }
      .btn span[class^="switch_icon_"] { font-size: 16px; }
      .variant-primary {
        background: var(--vf-primary);
        color: #fff;
      }
      .variant-ghost {
        background: transparent;
        color: var(--vf-muted);
      }
      .variant-danger {
        background: var(--vf-danger);
        color: #fff;
      }
    </style>
  `;
}
