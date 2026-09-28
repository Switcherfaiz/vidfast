export function styleSheet() {
  return `
    :host {
      display: block;
      height: 100dvh;
      max-height: 100dvh;
      overflow: hidden;
      background: #111;
      color: #fff;
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
    }
    * { box-sizing: border-box; font-family: inherit; margin: 0; padding: 0; }
    .meet {
      height: 100dvh;
      max-height: 100dvh;
      display: flex;
      flex-direction: column;
      padding: max(10px, env(safe-area-inset-top)) 14px max(10px, env(safe-area-inset-bottom));
      overflow: hidden;
    }
    .topbar {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #cbd5e1;
      font-weight: 600;
      font-size: 12px;
      min-height: 36px;
    }
    .code {
      opacity: 0.8;
      flex: 1;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 11px;
    }
    .timer-wrap {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0,0,0,0.35);
      padding: 4px 8px;
      border-radius: 999px;
      flex-shrink: 0;
    }
    .timer-wrap[hidden] { display: none; }
    .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ea4335; }
    .who {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      background: #2b2b2b;
      color: #fff;
      border-radius: 999px;
      padding: 3px 8px 3px 3px;
      cursor: pointer;
      flex-shrink: 0;
      max-width: 140px;
    }
    .who img { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .who span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
    .stage {
      flex: 1;
      min-height: 0;
      margin: 10px 0;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }
    .stage vf-stage-grid {
      position: absolute;
      inset: 0;
    }
    #ready-wrap {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 16px;
      background: rgba(0,0,0,0.28);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.28s ease;
      z-index: 5;
    }
    #ready-wrap.show { opacity: 1; pointer-events: auto; }
    #ready-wrap.pw-open { opacity: 0; pointer-events: none; }
    #ready-wrap vf-ready-card { animation: pop 0.36s cubic-bezier(0.22, 1, 0.36, 1); max-height: 100%; overflow: auto; }
    @keyframes pop {
      from { opacity: 0; transform: translateY(14px) scale(0.96); }
      to { opacity: 1; transform: none; }
    }
    .drawer {
      position: absolute;
      right: 8px;
      top: 8px;
      bottom: 8px;
      width: min(340px, calc(100% - 16px));
      z-index: 7;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      transform: translateX(18px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease;
      box-shadow: 0 16px 50px rgba(0,0,0,0.35);
    }
    .meet.chat-on .drawer { transform: none; opacity: 1; pointer-events: auto; }
    .drawer vf-chat-panel { flex: 1; min-height: 0; }
    .bar {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 4px 0;
    }
    .ctrl {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      background: #2b2b2b;
      color: #fff;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: transform 0.18s ease, background 0.18s ease;
      flex-shrink: 0;
    }
    .ctrl:hover { transform: translateY(-1px); }
    .ctrl.off { background: #3f3f3f; color: #fca5a5; }
    .ctrl.on { background: #14b8a6; color: #042f2e; }
    .ctrl.end { background: #ea4335; }
    .ctrl.ghost { background: #1a73e8; }
    .ctrl[hidden] { display: none; }
    .hint {
      flex-shrink: 0;
      text-align: center;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
    }
    .meet.live .hint { display: none; }
    .join-float {
      position: absolute;
      left: 50%;
      bottom: 18px;
      transform: translateX(-50%);
      z-index: 6;
      border: none;
      border-radius: 999px;
      padding: 12px 22px;
      background: #14b8a6;
      color: #042f2e;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(20,184,166,0.35);
    }
    .join-float[hidden] { display: none; }
    .join-toast {
      position: absolute;
      left: 50%;
      top: 12px;
      transform: translateX(-50%);
      z-index: 8;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      pointer-events: none;
    }
    .join-toast[hidden] { display: none; }
    .join-toast.ok { background: #14b8a6; color: #042f2e; }
    .join-toast.err { background: #ea4335; color: #fff; }
    @media (max-width: 720px) {
      .meet { padding: max(8px, env(safe-area-inset-top)) 10px max(8px, env(safe-area-inset-bottom)); }
      .ctrl { width: 40px; height: 40px; }
      .who { max-width: 110px; }
      .who span { display: none; }
      .drawer {
        left: 8px;
        right: 8px;
        width: auto;
        top: auto;
        bottom: 0;
        height: min(62vh, 420px);
        border-radius: 16px 16px 0 0;
        transform: translateY(100%);
      }
      .meet.chat-on .drawer { transform: none; }
    }
  `;
}
