export function styleSheet() {
  return `
    :host {
      display: block;
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
    }
    * { box-sizing: border-box; font-family: inherit; margin: 0; padding: 0; }
    .card {
      width: min(360px, calc(100vw - 48px));
      background: #fff;
      color: #202124;
      border-radius: 16px;
      padding: 16px 18px 14px;
      box-shadow: 0 16px 50px rgba(0,0,0,0.28);
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: calc(100% - 24px);
      overflow: auto;
    }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
    h2 { font-size: 22px; letter-spacing: -0.03em; }
    .icon-btn {
      width: 34px; height: 34px; border: none; background: #f1f3f4; border-radius: 50%;
      display: grid; place-items: center; cursor: pointer; color: #3c4043;
    }
    .add {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      border: none; background: #1a73e8; color: #fff; border-radius: 999px;
      padding: 10px 16px; font-weight: 700; cursor: pointer; width: fit-content;
    }
    .or { font-size: 13px; color: #5f6368; font-weight: 500; line-height: 1.45; }
    .link-box {
      display: flex; align-items: center; gap: 8px;
      background: #f1f3f4; border-radius: 10px; padding: 10px 10px 10px 12px;
    }
    .link-box span { flex: 1; min-width: 0; font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .note { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #5f6368; line-height: 1.45; }
    .join {
      border: none; background: #14b8a6; color: #fff; border-radius: 999px;
      padding: 11px 14px; font-weight: 800; cursor: pointer;
    }
    .join:disabled { opacity: 0.72; cursor: wait; }
    .join-status {
      font-size: 13px;
      font-weight: 700;
      line-height: 1.4;
      padding: 8px 10px;
      border-radius: 10px;
    }
    .join-status[hidden] { display: none; }
    .join-status.pending { background: #eef2f6; color: #475569; }
    .join-status.ok { background: #dcfce7; color: #166534; }
    .join-status.err { background: #fee2e2; color: #b91c1c; }
    @media (max-width: 720px) {
      .card { width: min(360px, calc(100vw - 32px)); }
    }
  `;
}
