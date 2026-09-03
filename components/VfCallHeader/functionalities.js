import { navigate } from 'switch-framework/router';

export function bindCallHeader(host) {
  host.listener('#vf-back', 'click', () => navigate('index'));
  host.listener('#vf-add-user', 'click', () => {
    alert('Invite link copied to clipboard (demo)');
  });
}
