import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    ${vfTheme}
    :host { display: block; width: 100%; font-family: var(--font, 'DM Sans', system-ui, sans-serif); }
    * { box-sizing: border-box; font-family: inherit; margin: 0; padding: 0; }
    .row { display: flex; align-items: flex-end; gap: 8px; width: 100%; }
    .row.me { justify-content: flex-end; }
    .row.them { justify-content: flex-start; }
    .col { display: flex; flex-direction: column; max-width: min(82%, 280px); min-width: 0; }
    .row.me .col { align-items: flex-end; }
    .author { font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 4px; }
    .bubble {
      padding: 10px 14px;
      font-size: 14px;
      line-height: 1.45;
      word-break: break-word;
      font-weight: 500;
    }
    .bubble.me {
      background: #ece7ff;
      color: #1e1b4b;
      border-radius: 16px 16px 6px 16px;
    }
    .bubble.them {
      background: #fff;
      color: #0f172a;
      border: 1px solid var(--vf-border);
      border-radius: 16px 16px 16px 6px;
    }
    .time { font-size: 11px; font-weight: 600; color: #94a3b8; margin-top: 4px; }
    .row.system {
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin: 10px 0;
      padding: 8px 14px;
      border-radius: 999px;
      background: var(--vf-primary-soft);
      color: var(--vf-primary-dark);
      font-size: 13px;
      font-weight: 700;
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
    .sys-ic { display: flex; }
  `;
}
