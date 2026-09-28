export function styleSheet() {
  return `
    :host { display: contents; font-family: var(--font, 'DM Sans', system-ui, sans-serif); }
    * { box-sizing: border-box; }
    .veil {
      position: fixed;
      inset: 0;
      background: rgba(6, 16, 24, 0.55);
      z-index: 40;
      display: grid;
      place-items: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.28s ease;
    }
    .veil.on { opacity: 1; pointer-events: auto; }
    .sheet {
      width: min(420px, 100%);
      background: #0b1c24;
      color: #e2e8f0;
      border-radius: 24px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.35);
      transform: translateY(16px) scale(0.96);
      transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .veil.on .sheet { transform: none; }
    header { width: 100%; display: flex; align-items: center; justify-content: space-between; }
    h2 { margin: 0; font-size: 18px; }
    .x {
      width: 34px; height: 34px; border: none; border-radius: 50%;
      background: #163042; color: #e2e8f0; cursor: pointer; display: grid; place-items: center;
    }
    .hint { margin: 0; color: #94a3b8; font-size: 13px; font-weight: 600; text-align: center; }
    label { width: 100%; display: flex; flex-direction: column; gap: 6px; font-size: 12px; font-weight: 800; color: #5eead4; }
    input {
      border: 1px solid #163042; background: #061018; color: #fff;
      border-radius: 12px; padding: 12px 14px; font-size: 15px;
    }
    .backs { display: flex; flex-wrap: wrap; gap: 8px; width: 100%; }
    .chip {
      border: 1px solid #163042; background: #061018; color: #cbd5e1;
      border-radius: 999px; padding: 8px 12px; font-weight: 700; cursor: pointer;
    }
    .chip.on { background: #14b8a6; color: #042f2e; border-color: #14b8a6; }
    .save {
      width: 100%; border: none; background: #14b8a6; color: #042f2e;
      border-radius: 999px; padding: 12px; font-weight: 800; cursor: pointer;
    }
  `;
}
