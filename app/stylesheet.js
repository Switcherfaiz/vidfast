import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}

      :host {
        display: block;
        min-height: 100vh;
        background: var(--vf-bg);
      }

      .wrap {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 32px;
        padding: 24px;
      }

      .hero {
        text-align: center;
      }

      .logo {
        width: 64px;
        height: 64px;
        margin-bottom: 16px;
      }

      .hero h1 {
        margin: 0 0 8px;
        font-size: 34px;
        font-weight: 700;
      }

      .hero p {
        margin: 0;
        color: var(--vf-muted);
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: min(320px, 100%);
      }

      .primary, .ghost {
        border-radius: 12px;
        padding: 14px 18px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        border: none;
      }

      .primary {
        background: var(--vf-primary);
        color: #fff;
      }

      .ghost {
        background: #fff;
        border: 1px solid var(--vf-border);
        color: var(--vf-text);
      }
    </style>
  `;
}
