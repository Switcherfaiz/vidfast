export const screen = {
  name: '+not-found',
  path: '/+not-found',
  title: 'Not Found',
  tag: 'sw-user-not-found-screen',
  layout: 'stack'
};

export class SwUserNotFoundScreen extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['path'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const path = this.getAttribute('path') || window.location.pathname || '';

    this.shadowRoot.innerHTML = `
      ${this.styleSheet()}
      <div class="wrap">
        <div class="card">
          <div class="code">404</div>
          <div class="h">This screen does not exist</div>
          <div class="p">No screen is registered for:</div>
          <div class="path">${path}</div>

          <div class="row">
            <button class="btn" id="home">Go to Home</button>
            <button class="btn secondary" id="back">Go Back</button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById('home')?.addEventListener('click', () => {
      const navigate = globalStates?.getState ? globalStates.getState('navigate') : null;
      if (typeof navigate === 'function') navigate('home');
    });

    this.shadowRoot.getElementById('back')?.addEventListener('click', () => {
      const goBack = globalStates?.getState ? globalStates.getState('go_back') : null;
      if (typeof goBack === 'function') goBack();
      else window.history.back();
    });
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100dvh;
          font-family: var(--font);
        }

        * {
          box-sizing: border-box;
          font-family: inherit;
        }

        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .card {
          width: min(680px, 100%);
          background: transparent;
          border: none;
          border-radius: 18px;
          padding: 18px;
          box-shadow: none;
        }

        .code {
          font-weight: 1000;
          font-size: 44px;
          line-height: 1;
          color: var(--main_text);
        }

        .h {
          margin-top: 10px;
          font-weight: 1000;
          font-size: 20px;
          color: var(--main_text);
        }

        .p {
          margin-top: 6px;
          color: var(--sub_text);
          font-weight: 800;
        }

        .path {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--surface_2);
          border: 1px solid var(--border_light);
          font-weight: 900;
          color: var(--main_text);
          word-break: break-word;
        }

        .row {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          border: none;
          background: linear-gradient(135deg, #0091ff 0%, #0073e6 100%);
          color: #fff;
          font-weight: 1000;
          border-radius: 999px;
          padding: 10px 14px;
          cursor: pointer;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn.secondary {
          background: var(--surface_2);
          color: var(--main_text);
        }

        .btn.secondary:hover {
          background: var(--surface_3);
        }
      </style>
    `;
  }
}

if (!customElements.get('sw-user-not-found-screen')) {
  customElements.define('sw-user-not-found-screen', SwUserNotFoundScreen);
}