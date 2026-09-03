import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .volume {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 12px 8px;
        background: rgba(15, 23, 42, 0.45);
        border-radius: 999px;
        backdrop-filter: blur(8px);
        z-index: 3;
      }

      .volume span {
        color: #fff;
        font-size: 14px;
      }

      .slider {
        writing-mode: bt-lr;
        appearance: slider-vertical;
        width: 4px;
        height: 80px;
        accent-color: #fff;
        cursor: pointer;
      }
    </style>
  `;
}
