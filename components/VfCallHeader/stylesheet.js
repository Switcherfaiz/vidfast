import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}
      @import '/assets/icons/style.css';

      .call-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding: 20px 24px 12px;
      }

      .left {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        min-width: 0;
      }

      .back {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 10px;
        background: transparent;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 4px;
      }

      .title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .title-row h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--vf-text);
      }

      .stats {
        display: flex;
        gap: 16px;
        margin-top: 6px;
        flex-wrap: wrap;
      }

      .stat {
        font-size: 13px;
        color: var(--vf-muted);
      }

      .stat strong { font-weight: 700; }
      .stat.invited strong { color: #38bdf8; }
      .stat.absent strong { color: var(--vf-warning); }
    </style>
  `;
}
