export function styleSheet() {
  return `
    :host {
      display: block;
      min-height: 100dvh;
      background:
        radial-gradient(circle at 10% 0%, rgba(20,184,166,0.16), transparent 36%),
        #eef2f6;
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
      color: #0f172a;
    }
    * { box-sizing: border-box; font-family: inherit; margin: 0; padding: 0; }
    .page { width: min(560px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 48px; display: flex; flex-direction: column; gap: 16px; }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
    .brand { display: flex; align-items: center; gap: 12px; }
    .brand img { width: 48px; height: 48px; border-radius: 14px; }
    .kicker { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #14b8a6; }
    h1 { font-size: 28px; letter-spacing: -0.04em; }
    .who {
      display: flex; align-items: center; gap: 10px;
      border: none; background: #fff; border-radius: 999px; padding: 6px 12px 6px 6px; cursor: pointer;
    }
    .who img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
    .who-meta { display: flex; flex-direction: column; text-align: left; }
    .who-meta strong { font-size: 14px; }
    .who-meta span { font-size: 12px; color: #64748b; }
    .hero {
      display: flex; align-items: center; gap: 14px; text-align: left;
      border: none; background: #14b8a6; color: #fff; border-radius: 22px; padding: 22px 18px; cursor: pointer;
    }
    .hero .ic { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; background: rgba(255,255,255,0.18); flex-shrink: 0; }
    .hero strong { display: block; font-size: 17px; }
    .hero p { margin-top: 4px; font-size: 13px; color: rgba(255,255,255,0.82); font-weight: 600; }
    .hero:disabled { opacity: 0.7; }
    .card {
      background: #fff; border-radius: 22px; padding: 22px; display: flex; flex-direction: column; gap: 12px;
      box-shadow: 0 12px 32px rgba(15,23,42,0.06);
    }
    .card h2 { font-size: 17px; }
    .card p { color: #64748b; font-weight: 600; }
    input {
      width: 100%; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; font-size: 15px; outline: none;
    }
    input:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.14); }
    .error { color: #ef4444; font-size: 13px; }
    .error[hidden] { display: none; }
    button#join_btn {
      border: none; background: #0f172a; color: #fff; border-radius: 999px; padding: 14px; font-weight: 800; cursor: pointer; font-size: 16px;
    }
    button#join_btn:disabled { opacity: 0.7; }
  `;
}
