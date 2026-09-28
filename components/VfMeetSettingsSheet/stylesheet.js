export function styleSheet() {
  return `
    :host { display: contents; font-family: var(--font, 'DM Sans', system-ui, sans-serif); }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
    .veil {
      position: fixed;
      inset: 0;
      background: rgba(6, 16, 24, 0.55);
      z-index: 42;
      display: grid;
      place-items: end center;
      padding: 16px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.28s ease;
    }
    .veil.on { opacity: 1; pointer-events: auto; }
    .sheet {
      width: min(440px, 100%);
      max-height: min(82vh, 640px);
      overflow: auto;
      background: #0b1c24;
      color: #e2e8f0;
      border-radius: 22px 22px 18px 18px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.35);
      transform: translateY(18px);
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .veil.on .sheet { transform: none; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    h2 { font-size: 18px; font-weight: 800; }
    .x {
      width: 34px; height: 34px; border: none; border-radius: 50%;
      background: #163042; color: #e2e8f0; cursor: pointer; display: grid; place-items: center;
    }
    .hint { color: #94a3b8; font-size: 12px; font-weight: 600; line-height: 1.45; }
    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border-radius: 14px;
      background: #061018;
      border: 1px solid #163042;
    }
    .section h3 { font-size: 12px; font-weight: 800; color: #5eead4; text-transform: uppercase; letter-spacing: 0.04em; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 700; color: #94a3b8; }
    input {
      border: 1px solid #163042; background: #0b1c24; color: #fff;
      border-radius: 12px; padding: 11px 12px; font-size: 14px;
    }
    .link-box {
      display: flex; align-items: center; gap: 8px;
      background: #0b1c24; border: 1px solid #163042; border-radius: 12px; padding: 10px 12px;
    }
    .link-box span { flex: 1; min-width: 0; font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #cbd5e1; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn {
      border: none; border-radius: 999px; padding: 10px 14px; font-size: 13px; font-weight: 800; cursor: pointer;
    }
    .btn.primary { background: #14b8a6; color: #042f2e; }
    .btn.ghost { background: #163042; color: #e2e8f0; }
    .btn.warn { background: #7f1d1d; color: #fecaca; }
    .btn.icon {
      width: 38px; height: 38px; padding: 0; display: grid; place-items: center; flex-shrink: 0;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 800; color: #5eead4;
      background: rgba(20,184,166,0.12); border-radius: 999px; padding: 5px 10px; width: fit-content;
    }
    .toggle {
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      padding: 10px 0 2px;
    }
    .toggle span { font-size: 14px; font-weight: 700; color: #e2e8f0; }
    .switch {
      width: 46px; height: 26px; border: none; border-radius: 999px; background: #334155; position: relative; cursor: pointer;
    }
    .switch.on { background: #14b8a6; }
    .switch::after {
      content: ''; position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #fff;
      transition: transform 0.2s ease;
    }
    .switch.on::after { transform: translateX(20px); }
    .note { font-size: 11px; color: #64748b; font-weight: 600; }
    .status { font-size: 12px; font-weight: 700; color: #86efac; min-height: 18px; }
    .status.err { color: #fca5a5; }
    @media (max-width: 720px) {
      .veil { place-items: end stretch; padding: 0; }
      .sheet { width: 100%; border-radius: 18px 18px 0 0; max-height: 78vh; }
    }
  `;
}
