export function styleSheet() {
  return `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 0;
      position: relative;
      container-type: size;
      font-family: var(--font, 'DM Sans', system-ui, sans-serif);
    }
    * { box-sizing: border-box; font-family: inherit; margin: 0; padding: 0; }
    .tiles {
      width: 100%;
      height: 100%;
      display: grid;
      gap: clamp(6px, 1.2cqw, 12px);
      grid-template-columns: repeat(var(--cols, 1), minmax(0, 1fr));
      grid-template-rows: repeat(var(--rows, 1), minmax(0, 1fr));
      align-content: center;
      justify-content: center;
    }
    .tiles[data-layout="solo"] { padding: clamp(0px, 5cqw, 64px); }
    .tiles[data-layout="solo"] .tile { width: min(100%, 1040px); justify-self: center; }
    .tile {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      background: #1a1a1a;
      min-height: 0;
      min-width: 0;
      contain: layout paint;
      transition: border-radius .25s ease, box-shadow .25s ease;
    }
    .tile[hidden] { display: none; }
    .tile.remote.in { animation: tile-in .36s cubic-bezier(.22,1,.36,1); }
    .tile.out { animation: tile-out .3s ease forwards; pointer-events: none; }
    @keyframes tile-in {
      from { opacity: 0; transform: scale(0.92) translateY(10px); }
      to { opacity: 1; transform: none; }
    }
    @keyframes tile-out {
      to { opacity: 0; transform: scale(0.92); }
    }
    .tile video { width: 100%; height: 100%; object-fit: cover; background: #111; display: block; }
    .tile.self video { transform: scaleX(-1); }
    .tile.off video { opacity: 0; }
    .tile.connecting::before,
    .tile.failed::before {
      content: 'Connecting media…';
      position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%);
      z-index: 3; padding: 6px 10px; border-radius: 999px;
      background: rgba(15,23,42,.78); color: #e2e8f0; font-size: 11px; font-weight: 800;
      pointer-events: none; white-space: nowrap;
    }
    .tile.failed::before { content: 'Media failed — retrying via relay'; background: #7f1d1d; }
    .tile.tap-audio::after {
      content: 'Tap for audio';
      position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%);
      z-index: 3; padding: 6px 10px; border-radius: 999px;
      background: #14b8a6; color: #042f2e; font-size: 11px; font-weight: 800;
      pointer-events: none;
    }
    .face {
      position: absolute;
      inset: 0;
      display: none;
      place-items: center;
      background: #3f1d1d;
      font-size: clamp(24px, 8vw, 48px);
      font-weight: 800;
      color: #fff;
    }
    .tile.off .face { display: grid; }
    .cam-off {
      position: absolute;
      inset: 0;
      display: none;
      place-items: center;
      background: #3f1d1d;
      font-size: clamp(24px, 8vw, 48px);
      font-weight: 800;
    }
    .cam-off.show { display: grid; }
    .tag {
      position: absolute;
      left: 8px;
      top: 8px;
      background: rgba(15,23,42,0.62);
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tile-expand {
      position: absolute;
      right: 8px;
      top: 8px;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 999px;
      background: rgba(15,23,42,0.62);
      color: #fff;
      cursor: pointer;
      display: grid;
      place-items: center;
      z-index: 2;
    }
    .tile-expand:hover { background: rgba(20,184,166,0.85); color: #042f2e; }
    .tiles.focus-mode {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      grid-template-rows: minmax(0, 1fr) clamp(76px, 18cqh, 126px);
      align-content: stretch;
      overflow-x: auto;
      scroll-snap-type: x proximity;
    }
    .tiles.focus-mode .tile.focused {
      grid-column: 1 / 13;
      grid-row: 1;
      min-height: 0;
    }
    .tiles.focus-mode .tile.minimized {
      grid-row: 2;
      grid-column: span 2;
      min-height: 76px;
      cursor: pointer;
      scroll-snap-align: start;
    }
    .tiles.focus-mode .tile.focused .tile-expand { background: #14b8a6; color: #042f2e; }
    .pages {
      position: absolute;
      left: 50%;
      bottom: 10px;
      transform: translateX(-50%);
      z-index: 4;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 8px;
      border-radius: 999px;
      background: rgba(15,23,42,.75);
      backdrop-filter: blur(8px);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
    }
    .pages[hidden] { display: none; }
    .pages button {
      width: 28px; height: 28px; border: none; border-radius: 50%;
      background: #14b8a6; color: #042f2e; font-size: 20px; cursor: pointer;
    }
    .pages button:disabled { opacity: .35; cursor: default; }
    @container (max-width: 600px) {
      .tiles.focus-mode { grid-template-columns: repeat(6, minmax(76px, 1fr)); }
      .tiles.focus-mode .tile.focused { grid-column: 1 / 7; }
      .tiles.focus-mode .tile.minimized { grid-column: span 2; }
      .tag { max-width: calc(100% - 46px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .tile.remote.in, .tile.out { animation-duration: 1ms; }
    }
  `;
}
