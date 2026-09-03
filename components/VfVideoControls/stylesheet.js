import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .controls {
        position: absolute;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: rgba(15, 23, 42, 0.72);
        border-radius: 999px;
        backdrop-filter: blur(10px);
        z-index: 4;
      }

      .ctrl {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ctrl span { font-size: 16px; }
      .ctrl.off { background: rgba(255, 255, 255, 0.08); color: #cbd5e1; }

      .ctrl.end {
        width: 52px;
        height: 52px;
        background: var(--vf-danger);
      }
    </style>
  `;
}
