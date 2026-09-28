import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    ${vfTheme}
    :host { display: block; flex-shrink: 0; }
    .tabs {
      display: flex;
      gap: 22px;
      border-bottom: 1px solid var(--vf-border);
      padding: 0 20px;
    }
    .tab {
      border: none;
      background: transparent;
      padding: 12px 0;
      font-size: 14px;
      font-weight: 700;
      color: #94a3b8;
      cursor: pointer;
      position: relative;
    }
    .tab.active { color: var(--vf-primary-dark); }
    .tab.active::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -1px;
      height: 2px;
      background: var(--vf-primary);
      border-radius: 2px 2px 0 0;
    }
  `;
}
