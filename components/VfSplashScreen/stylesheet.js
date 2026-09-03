import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}

      :host {
        position: fixed;
        inset: 0;
        display: block;
        background: var(--vf-bg);
        z-index: 9999;
      }

      .wrap {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .logo {
        width: 56px;
        height: 56px;
      }

      .title {
        font-size: 28px;
        font-weight: 700;
        color: var(--vf-text);
      }

      .sub {
        font-size: 14px;
        color: var(--vf-muted);
      }

      .loader {
        width: 36px;
        height: 36px;
        margin-top: 12px;
        border-radius: 50%;
        border: 3px solid rgba(62, 180, 137, 0.2);
        border-top-color: var(--vf-primary);
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
}
