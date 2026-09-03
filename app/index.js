import { SwitchComponent, getState } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { styleSheet } from './stylesheet.js';

export class VfIndexScreen extends SwitchComponent {
  static screenName = 'index';
  static path = '/';
  static title = 'VidFast';
  static tag = 'vf-index-screen';
  static layout = 'stack';
  static { this.useState('calls'); }

  onMount() {
    this.listener('#enter-demo', 'click', () => {
      const calls = getState('calls') || [];
      if (calls[0]?.id) {
        navigate(`call/${calls[0].id}`);
        return;
      }
      navigate('login');
    });
    this.listener('#login-btn', 'click', () => navigate('login'));
  }

  render() {
    return `
      <div class="wrap vf-theme">
        <div class="hero">
          <img src="/assets/logo.svg" alt="VidFast" class="logo" />
          <h1>VidFast</h1>
          <p>Fast, beautiful video meetings</p>
        </div>
        <div class="actions">
          <button id="enter-demo" class="primary" type="button">Enter demo call</button>
          <button id="login-btn" class="ghost" type="button">Sign in</button>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}
