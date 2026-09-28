import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    ${vfTheme}
    :host { display: block; flex-shrink: 0; }
    .composer { display: flex; padding: 10px 14px 16px; }
    .box {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      background: #fff;
      border: 1.5px solid #ebebeb;
      border-radius: 26px;
      padding: 6px 6px 6px 14px;
    }
    .box:focus-within {
      border-color: color-mix(in srgb, var(--vf-primary) 45%, #ddd);
      box-shadow: 0 0 0 3px var(--vf-primary-soft);
    }
    .reply {
      flex: 1; min-width: 0; border: none; background: transparent;
      padding: 8px 0; font-size: 15px; line-height: 20px; outline: none;
      color: var(--vf-text); font-family: inherit;
      resize: none; min-height: 36px; max-height: 140px;
      overflow-y: auto;
    }
    .send {
      width: 38px; height: 38px; border: none; border-radius: 50%;
      background: var(--vf-primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0;
    }
    .send:hover { background: var(--vf-primary-dark); }
    .send svg { display: block; }
  `;
}
