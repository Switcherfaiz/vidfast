import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    ${vfTheme}

    :host {
      display: flex;
      width: 100%;
      min-width: 0;
      height: 100%;
      min-height: 0;
    }

    .chat-panel {
      width: 100%;
      background: #f8fafc;
      border-left: 1px solid var(--vf-border);
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }
    vf-chat-thread { flex: 1; min-height: 180px; display: flex; }
    .pane { flex: 1; min-height: 0; display: flex; flex-direction: column; }
    .pane[hidden] { display: none; }
    .participants img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }

    .participants {
      flex: 1;
      overflow: auto;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .person {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: #fff;
      border-radius: 14px;
      border: 1px solid var(--vf-border);
    }

    .person .meta { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .person strong { font-size: 14px; }
    .person span { font-size: 12px; color: #94a3b8; font-weight: 600; }
    .kick, .soft {
      border: none; border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 800; cursor: pointer;
    }
    .kick { background: #fee2e2; color: #b91c1c; }
    .soft { background: #eef2f6; color: #334155; }
    .empty-note {
      margin: auto;
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
      font-weight: 600;
      padding: 24px;
    }
  `;
}
