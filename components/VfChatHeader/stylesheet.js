import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    ${vfTheme}
    :host { display: block; flex-shrink: 0; }
    .head { padding: 18px 20px 8px; }
    .name { font-size: 18px; font-weight: 800; letter-spacing: -0.03em; }
    .sub { margin-top: 4px; font-size: 13px; color: #94a3b8; font-weight: 600; }
  `;
}
