import { SwitchComponent, updateState } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { apiSend } from '../api.js';
import { styleSheet } from './stylesheet.js';

export class VfLoginScreen extends SwitchComponent {
  static screenName = 'login';
  static path = '/login';
  static title = 'Sign in';
  static tag = 'vf-login-screen';
  static layout = 'stack';

  onMount() {
    this.listener('#login-form', 'submit', (e) => this.handleSubmit(e));
    this.listener('#back-home', 'click', () => navigate('index'));
  }

  async handleSubmit(e) {
    e.preventDefault();
    const email = this.query('#email')?.value || '';
    const password = this.query('#password')?.value || '';
    const errEl = this.query('#error');
    try {
      const res = await apiSend('/auth/login', 'POST', { email, password });
      updateState('user', res.user);
      navigate('index');
    } catch (err) {
      if (errEl) errEl.textContent = err.message || 'Login failed';
    }
  }

  render() {
    return `
      <div class="wrap vf-theme">
        <button id="back-home" class="back" type="button">← Back</button>
        <form id="login-form" class="card">
          <h1>Sign in to VidFast</h1>
          <p class="hint">Demo: kate@vidfast.app / vid123</p>
          <label>Email<input id="email" type="email" value="kate@vidfast.app" required /></label>
          <label>Password<input id="password" type="password" value="vid123" required /></label>
          <p id="error" class="error"></p>
          <button type="submit">Sign in</button>
        </form>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}
