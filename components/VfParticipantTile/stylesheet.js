import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .tile {
        position: relative;
        width: 72px;
        height: 72px;
        border-radius: 16px;
        overflow: hidden;
        border: 2px solid rgba(255,255,255,0.85);
        box-shadow: 0 4px 14px rgba(15,23,42,0.18);
        background: #0f172a;
      }

      .tile .video {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
      }

      .tile vf-avatar {
        position: absolute;
        right: 4px;
        bottom: 4px;
      }

      .tile .mute {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: rgba(255,92,92,0.92);
        color: #fff;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tile.invite {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.15);
        border-style: dashed;
        color: #fff;
      }

      .tile.invite span { font-size: 20px; }
    </style>
  `;
}
