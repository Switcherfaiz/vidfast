import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .sidebar {
        width: 72px;
        min-height: 100%;
        background: var(--vf-sidebar);
        border-right: 1px solid var(--vf-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px 0;
        gap: 18px;
      }

      .logo img {
        width: 34px;
        height: 34px;
        display: block;
      }

      .nav {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
      }

      .nav-item {
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 12px;
        background: transparent;
        color: #94a3b8;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .nav-item span { font-size: 18px; }

      .nav-item.active {
        background: rgba(62, 180, 137, 0.15);
        color: var(--vf-primary);
      }

      .nav-item.active::before {
        content: '';
        position: absolute;
        left: -14px;
        width: 4px;
        height: 24px;
        border-radius: 0 4px 4px 0;
        background: var(--vf-primary);
      }

      .profile {
        margin-top: auto;
      }
    </style>
  `;
}
