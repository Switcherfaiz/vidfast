import { vfTheme } from '../../assets/styles/tokens.js';

export function styleSheet() {
  return `
    <style>
      ${vfTheme}

      :host {
        display: block;
        width: 100%;
        min-height: 100vh;
        background: var(--vf-bg);
      }

      .vf-app {
        display: flex;
        min-height: 100vh;
        width: 100%;
      }

      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .stage {
        flex: 1;
        display: flex;
        min-height: 0;
      }

      .video-area {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
      }
    </style>
  `;
}
