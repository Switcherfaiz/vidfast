import { deliverMeetingPassword } from '../../app/lib/passwordPrompt.js';

export function bindPasswordSheet(host) {
  host.listener('#pw-close', 'click', () => host.dismiss());
  host.listener('#pw-cancel', 'click', () => host.dismiss());

  const submit = () => {
    if (host._submitting) return;
    const input = host.select('#pw-input');
    const value = String(input?.value || '').trim();
    if (!value) {
      const err = host.select('#pw-error');
      if (err) err.textContent = 'Enter the room password.';
      input?.focus();
      return;
    }
    host._submitting = true;
    const btn = host.select('#pw-submit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Joining…';
    }
    deliverMeetingPassword(value);
    host._submitting = false;
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Join room';
    }
  };

  host.listener('#pw-submit', 'click', submit);
  host.listener('#pw-input', 'keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  });
}
