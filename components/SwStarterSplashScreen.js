import { SwitchComponent } from 'switch-framework';

export class SwStarterSplashScreen extends SwitchComponent {
  static tag = 'sw-starter-splash';

  render() {
    return `
      <div class="wrap">
        <div class="card">
          <div class="logo-container">
            <span class="switch_icon_video logo-icon"></span>
          </div>
          <div class="title">VidFast</div>
          <div class="sub">Launching...</div>
          
          <div class="loader-container">
            <div class="loader"></div>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          position: fixed;
          inset: 0;
          display: block;
          background: var(--page_background, #fff);
          z-index: 9999;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .wrap {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .card {
          width: min(520px, 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, rgba(138, 92, 245, 0.2) 0%, rgba(138, 92, 245, 0.4) 100%);
          border-radius: 28px;
          box-shadow: 0 20px 40px rgba(138, 92, 245, 0.25);
          animation: fadeInScale 0.6s ease-out;
        }

        .logo-icon {
          font-size: 48px;
          color: #8A5CF5;
        }

        .title {
          font-weight: 700;
          font-size: 24px;
          color: var(--main_text, #000);
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .sub {
          font-weight: 600;
          font-size: 13px;
          color: var(--sub_text, #666);
          animation: fadeIn 0.8s ease-out 0.3s both;
        }

        .loader-container {
          margin-top: 12px;
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(0, 145, 255, 0.15);
          border-top: 3px solid #0091ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      </style>
    `;
  }
}
