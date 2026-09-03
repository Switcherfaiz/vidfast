import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .main-video {
        position: relative;
        display: flex;
        gap: 12px;
        padding: 0 24px;
      }

      .feed {
        flex: 1;
        min-height: 420px;
        border-radius: var(--vf-radius-lg);
        background-size: cover;
        background-position: center;
        position: relative;
        overflow: hidden;
        box-shadow: var(--vf-shadow);
      }

      .feed::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.05) 40%, rgba(15,23,42,0.35) 100%);
        pointer-events: none;
      }

      .publisher {
        position: absolute;
        top: 16px;
        left: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px 6px 6px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 999px;
        z-index: 2;
        color: #fff;
      }

      .pub-meta {
        display: flex;
        flex-direction: column;
        line-height: 1.1;
      }

      .pub-meta .role {
        font-size: 10px;
        opacity: 0.75;
      }

      .pub-meta .name {
        font-size: 13px;
        font-weight: 600;
      }

      .timer {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 999px;
        color: #fff;
        font-size: 13px;
        font-weight: 600;
        z-index: 2;
      }

      .timer .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--vf-danger);
      }

      .stack {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 8px;
      }
    </style>
  `;
}
