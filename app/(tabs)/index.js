import { SwitchComponent } from 'switch-framework';

export class SwHomeScreen extends SwitchComponent {
  static screenName = 'home';
  static path = '/home';
  static title = 'Home';
  static tag = 'sw-home-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="wrap">
        <div class="spacer-top"></div>
        
        <div class="hero">
          <div class="logo-container">
            <img class="logo" src="/assets/logo.svg" alt="Switch Framework" />
          </div>
          <div class="title">Tabs View</div>
        </div>

        <div class="spacer-middle"></div>

        <div class="section">
          <div class="label">GET STARTED</div>
          
          <div class="card">
            <div class="row">
              <div class="l">Try editing</div>
              <div class="r">src/app/(tabs)/index.js</div>
            </div>
            <div class="row">
              <div class="l">Dev tools</div>
              <div class="r">cmd+d</div>
            </div>
            <div class="row">
              <div class="l">Fresh start</div>
              <div class="r">npm reset project</div>
            </div>
          </div>
        </div>

        <div class="spacer-bottom"></div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          padding: 0;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
          height: 100%;
          background: var(--bg, #fff);
        }

        * {
          box-sizing: border-box;
          font-family: inherit;
        }

        .wrap {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
        }

        .spacer-top {
          flex: 1;
          min-height: 40px;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #0091ff 0%, #0073e6 100%);
          border-radius: 32px;
          box-shadow: 0 20px 40px rgba(0, 145, 255, 0.3);
        }

        .logo {
          width: 70px;
          height: 70px;
          filter: brightness(0) invert(1);
        }

        .title {
          font-weight: 700;
          color: var(--main_text, #000);
          font-size: 36px;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .spacer-middle {
          flex: 0.8;
          min-height: 20px;
        }

        .section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }

        .label {
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 1.2px;
          color: var(--sub_text, #666);
          text-transform: uppercase;
          padding: 0 12px;
        }

        .card {
          width: 100%;
          background: #f5f5f5;
          border-radius: 20px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
        }

        :root[data-theme="dark"] .card {
          background: rgba(255, 255, 255, 0.08);
        }

        .row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          transition: background 0.2s ease;
        }

        .row:active {
          background: rgba(0, 0, 0, 0.08);
        }

        :root[data-theme="dark"] .row {
          background: rgba(255, 255, 255, 0.06);
        }

        :root[data-theme="dark"] .row:active {
          background: rgba(255, 255, 255, 0.12);
        }

        .l {
          font-weight: 600;
          color: var(--main_text, #000);
          font-size: 14px;
        }

        .r {
          font-weight: 500;
          color: var(--sub_text, #666);
          background: rgba(0, 0, 0, 0.05);
          padding: 6px 12px;
          border-radius: 999px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 11px;
          white-space: nowrap;
        }

        :root[data-theme="dark"] .r {
          background: rgba(255, 255, 255, 0.1);
        }

        .spacer-bottom {
          flex: 1;
          min-height: 20px;
        }
        @media (max-width: 600px) {
          .title {
            font-size: 32px;
          }
        }
      </style>
    `;
  }
}
