export function styleSheet() {
  return `
    :host { font-family: var(--font, 'DM Sans', system-ui, sans-serif); }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
    .sheet {
      width: min(400px, 100%);
      background: #0b1c24;
      color: #e2e8f0;
      border-radius: 20px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.4);
    }
    header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    h2 { font-size: 20px; font-weight: 800; }
    .x {
      width: 34px; height: 34px; border: none; border-radius: 50%;
      background: #163042; color: #e2e8f0; cursor: pointer; display: grid; place-items: center;
    }
    .hint { color: #94a3b8; font-size: 13px; font-weight: 600; line-height: 1.45; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 800; color: #5eead4; }
    input {
      border: 1px solid #163042; background: #061018; color: #fff;
      border-radius: 12px; padding: 12px 14px; font-size: 15px;
    }
    .row { display: flex; gap: 8px; }
    .btn {
      flex: 1; border: none; border-radius: 999px; padding: 12px; font-size: 14px; font-weight: 800; cursor: pointer;
    }
    .btn.primary { background: #14b8a6; color: #042f2e; }
    .btn.ghost { background: #163042; color: #e2e8f0; }
    .err { color: #fca5a5; font-size: 12px; font-weight: 700; min-height: 16px; }
  `;
}
