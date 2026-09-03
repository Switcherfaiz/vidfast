import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      .avatar {
        border-radius: 50%;
        overflow: hidden;
        background: #dbeafe;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .avatar.ring {
        box-shadow: 0 0 0 2px #fff, 0 0 0 3px var(--vf-primary);
      }
      .avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .avatar span {
        font-size: 0.85em;
        font-weight: 700;
        color: #334155;
      }
    </style>
  `;
}
