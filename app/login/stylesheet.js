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
        align-items: center;
        justify-content: center;
        padding: 24px;
        position: relative;
      }

      .back {
        position: absolute;
        top: 24px;
        left: 24px;
        border: none;
        background: transparent;
        color: var(--vf-muted);
        cursor: pointer;
        font-size: 14px;
      }

      .card {
        width: min(400px, 100%);
        background: #fff;
        border-radius: 20px;
        padding: 28px;
        border: 1px solid var(--vf-border);
        box-shadow: var(--vf-shadow);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card h1 {
        margin: 0;
        font-size: 24px;
      }

      .hint {
        margin: 0;
        font-size: 13px;
        color: var(--vf-muted);
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
      }

      input {
        border: 1px solid var(--vf-border);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
      }

      .error {
        margin: 0;
        color: var(--vf-danger);
        font-size: 13px;
        min-height: 18px;
      }

      button[type="submit"] {
        margin-top: 8px;
        border: none;
        border-radius: 12px;
        padding: 12px;
        background: var(--vf-primary);
        color: #fff;
        font-weight: 600;
        cursor: pointer;
      }
    </style>
  `;
}
