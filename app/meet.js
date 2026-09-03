import { SwitchComponent, updateState, getState } from 'switch-framework';
import { navigate } from 'switch-framework/router';

/**
 * Handles /meet/:id - redirects to meeting with the room link set.
 */
export class SwMeetScreen extends SwitchComponent {
  static screenName = 'meet';
  static path = '/meet/:id';
  static title = 'Join meeting';
  static tag = 'sw-meet-screen';
  static layout = 'stack';

  onMount() {
    const params = getState('routeParams') || {};
    const id = params.id;
    if (id) {
      const link = `${window.location.origin}/meet/${id}`;
      updateState('meeting-link', link);
      navigate('meeting');
    } else {
      navigate('index');
    }
  }

  render() {
    return `
      <div class="wrap">
        <p>Joining meeting...</p>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host { display: block; padding: 24px; font-family: system-ui, sans-serif; }
        .wrap { text-align: center; color: #64748b; }
      </style>
    `;
  }
}
