import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        line-height: 1;
      }
      .tone-neutral {
        background: #f1f5f9;
        color: #64748b;
      }
      .tone-primary {
        background: rgba(62, 180, 137, 0.12);
        color: var(--vf-primary-dark);
      }
      .tone-new {
        background: rgba(62, 180, 137, 0.15);
        color: var(--vf-primary-dark);
      }
    </style>
  `;
}
