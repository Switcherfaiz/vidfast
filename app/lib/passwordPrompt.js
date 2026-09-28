import { updateState } from 'switch-framework';

let pending = null;

export function requestMeetingPassword(reason = 'This room is locked.') {
  if (pending) return pending.promise;
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  pending = { resolve, promise };
  updateState('meet-settings-open', false);
  updateState('password-prompt-reason', reason);
  updateState('password-prompt-open', true);
  return promise;
}

export function deliverMeetingPassword(value) {
  const pwd = String(value || '').trim();
  updateState('password-prompt-open', false);
  updateState('meeting-password', pwd);
  pending?.resolve(pwd);
  pending = null;
  return pwd;
}

export function cancelMeetingPassword() {
  updateState('password-prompt-open', false);
  pending?.resolve('');
  pending = null;
}
