import { SwitchComponent, replace, ensureState, updateState, getState, onState } from 'switch-framework';

const SLIDES = [
  { title: 'No accounts.', text: 'Open the link. You are already in — as a random guest that only exists for this tab.' },
  { title: 'Face to face.', text: 'Video and audio go browser to browser. The server only introduces you, then forgets.' },
  { title: 'Share and vanish.', text: 'A long unguessable link. When the last person leaves, the room evaporates.' }
];

ensureState('intro-step', 0);

function paint(comp) {
  const step = getState('intro-step') || 0;
  const current = SLIDES[Math.min(step, SLIDES.length - 1)];
  const title = comp.select('#hero-title');
  const text = comp.select('#slide-text');
  const next = comp.select('#next');
  if (title) title.textContent = current.title;
  if (text) text.textContent = current.text;
  if (next) next.textContent = step >= SLIDES.length - 1 ? 'Enter as a guest' : 'Next';
  comp.selectAll('.dot').forEach((dot, i) => dot.classList.toggle('on', i === step));
}

export class VfIntroScreen extends SwitchComponent {
  static screenName = 'intro';
  static path = '/intro';
  static title = 'Intro';
  static tag = 'vf-intro-screen';

  onMount() {
    onState('intro-step', () => paint(this));
    paint(this);
    this.listener('#skip', 'click', () => this.finish());
    this.listener('#next', 'click', () => {
      const step = getState('intro-step') || 0;
      if (step >= SLIDES.length - 1) return this.finish();
      updateState('intro-step', step + 1);
    });
  }

  finish() {
    localStorage.setItem('intro', 'true');
    replace('join', { __url: '/', __lockHistory: true });
  }

  render() {
    return `
      <div class="stage">
        <div class="orbit" aria-hidden="true">
          <span class="ring r1"></span>
          <span class="ring r2"></span>
          <span class="ring r3"></span>
          <span class="pulse"></span>
          ${Array.from({ length: 8 }).map((_, i) => `<span class="node n${i}"></span>`).join('')}
        </div>
        <div class="copy">
          <div class="brand">
            <img src="/assets/logo.svg" alt="" />
            <span>VidFast</span>
          </div>
          <h1 id="hero-title">${SLIDES[0].title}</h1>
          <p id="slide-text">${SLIDES[0].text}</p>
          <div class="pager">${SLIDES.map((_, i) => `<span class="dot${i === 0 ? ' on' : ''}"></span>`).join('')}</div>
          <button id="next" class="btn" type="button">Next</button>
          <button id="skip" class="ghost" type="button">Skip</button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      :host { position: fixed; inset: 0; display: block; background: #061018; color: #f8fafc; font-family: var(--font, 'DM Sans', system-ui, sans-serif); }
      * { box-sizing: border-box; }
      .stage { min-height: 100dvh; display: grid; place-items: center; padding: 24px; position: relative; overflow: hidden; }
      .orbit { position: absolute; inset: 0; pointer-events: none; }
      .ring { position: absolute; left: 50%; top: 46%; border: 1px solid rgba(20,184,166,0.18); border-radius: 50%; transform: translate(-50%, -50%); }
      .r1 { width: min(72vw, 560px); height: min(72vw, 560px); animation: spin 22s linear infinite; }
      .r2 { width: min(52vw, 400px); height: min(52vw, 400px); animation: spin 16s linear infinite reverse; }
      .r3 { width: min(32vw, 240px); height: min(32vw, 240px); border-color: rgba(20,184,166,0.35); }
      .pulse { position: absolute; left: 50%; top: 46%; width: 18px; height: 18px; border-radius: 50%; background: #14b8a6; transform: translate(-50%, -50%); box-shadow: 0 0 40px #14b8a6; animation: pulse 2.2s ease-in-out infinite; }
      .node { position: absolute; left: 50%; top: 46%; width: 10px; height: 10px; margin: -5px; border-radius: 50%; background: #5eead4; }
      .n0 { animation: orbit 14s linear infinite; }
      .n1 { animation: orbit 18s linear infinite reverse; animation-delay: -4s; }
      .n2 { animation: orbit 12s linear infinite; animation-delay: -2s; background: #38bdf8; }
      .n3 { animation: orbit 20s linear infinite reverse; animation-delay: -7s; }
      .n4 { animation: orbit 15s linear infinite; animation-delay: -9s; background: #a78bfa; }
      .n5 { animation: orbit 17s linear infinite reverse; animation-delay: -1s; }
      .n6 { animation: orbit 13s linear infinite; animation-delay: -6s; background: #fbbf24; }
      .n7 { animation: orbit 19s linear infinite reverse; animation-delay: -11s; }
      @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
      @keyframes pulse { 50% { transform: translate(-50%, -50%) scale(1.35); opacity: 0.7; } }
      @keyframes orbit {
        from { transform: rotate(0deg) translateX(min(28vw, 210px)) rotate(0deg); }
        to { transform: rotate(360deg) translateX(min(28vw, 210px)) rotate(-360deg); }
      }
      .copy { position: relative; z-index: 2; width: min(480px, 100%); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; font-size: 12px; color: #5eead4; }
      .brand img { width: 40px; height: 40px; border-radius: 12px; }
      h1 { margin: 8px 0 0; font-size: clamp(40px, 8vw, 72px); letter-spacing: -0.06em; line-height: 0.95; }
      p { margin: 0; max-width: 36ch; color: #94a3b8; font-weight: 600; line-height: 1.55; }
      .pager { display: flex; gap: 8px; }
      .dot { width: 8px; height: 8px; border-radius: 99px; background: #1e3a44; }
      .dot.on { width: 22px; background: #14b8a6; }
      .btn { width: 100%; border: none; background: #14b8a6; color: #042f2e; font-weight: 800; border-radius: 999px; padding: 14px; cursor: pointer; font-size: 16px; }
      .btn:hover { background: #2dd4bf; }
      .ghost { border: none; background: transparent; color: #94a3b8; font-weight: 700; cursor: pointer; padding: 8px; }
    `;
  }
}
