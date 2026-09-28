export function styleSheet() {
  return `
    :host {
      display: block; min-height: 100dvh; color: #e2e8f0;
      background: radial-gradient(circle at 15% 0%, rgba(20,184,166,.2), transparent 34%), #061018;
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
    .page { width: min(680px, calc(100% - 28px)); margin: 0 auto; padding: 24px 0 56px; display: flex; flex-direction: column; gap: 16px; }
    .top { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 14px; }
    .round { width: 42px; height: 42px; border: none; border-radius: 50%; display: grid; place-items: center; background: #163042; color: #fff; cursor: pointer; }
    .eyebrow { color: #5eead4; font-size: 11px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
    h1 { font-size: clamp(24px, 5vw, 34px); letter-spacing: -.04em; }
    .temporary { padding: 7px 10px; border-radius: 999px; background: rgba(20,184,166,.12); color: #5eead4; font-size: 11px; font-weight: 900; }
    .hero-card, .card { border: 1px solid #163042; background: rgba(11,28,36,.92); border-radius: 22px; }
    .hero-card { padding: 24px; display: flex; align-items: center; gap: 18px; }
    .avatar-wrap { position: relative; flex-shrink: 0; }
    .avatar-wrap img { width: 92px; height: 92px; border-radius: 50%; object-fit: cover; box-shadow: 0 12px 30px rgba(0,0,0,.25); }
    .online { position: absolute; right: 5px; bottom: 7px; width: 17px; height: 17px; border: 3px solid #0b1c24; border-radius: 50%; background: #22c55e; }
    .hero-card h2 { font-size: 24px; margin-bottom: 5px; }
    .hero-card p { color: #94a3b8; font-size: 13px; line-height: 1.5; }
    .card { padding: 20px; display: flex; flex-direction: column; gap: 15px; }
    .card h3 { color: #5eead4; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    label, .field { display: flex; flex-direction: column; gap: 8px; color: #94a3b8; font-size: 12px; font-weight: 800; }
    input { width: 100%; border: 1px solid #294556; background: #061018; color: #fff; border-radius: 14px; padding: 14px; font-size: 16px; outline: none; }
    input:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,.14); }
    .colors, .backs { display: flex; flex-wrap: wrap; gap: 10px; }
    .colors button { width: 38px; height: 38px; border: 3px solid transparent; border-radius: 50%; background: var(--color); cursor: pointer; }
    .colors button.on { border-color: #fff; box-shadow: 0 0 0 3px #14b8a6; }
    .backs button { border: 1px solid #294556; border-radius: 999px; background: #163042; color: #cbd5e1; padding: 10px 15px; font-weight: 800; cursor: pointer; }
    .backs button.on { background: #14b8a6; border-color: #14b8a6; color: #042f2e; }
    .save { border: none; border-radius: 999px; padding: 15px; background: #14b8a6; color: #042f2e; font-size: 15px; font-weight: 900; cursor: pointer; }
    .status { min-height: 18px; text-align: center; color: #86efac; font-size: 12px; font-weight: 800; }
    .status.err { color: #fca5a5; }
    @media (max-width: 520px) {
      .hero-card { align-items: flex-start; padding: 18px; }
      .avatar-wrap img { width: 72px; height: 72px; }
      .temporary { display: none; }
    }
  `;
}
