import { SwitchComponent, getState, createProps, registerComponent } from 'switch-framework';
import '../VfBadge/index.js';
import '../VfButton/index.js';
import { escapeHtml } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';
import { bindCallHeader } from './functionalities.js';

export class VfCallHeader extends SwitchComponent {
  static tag = 'vf-call-header';

  onMount() {
    bindCallHeader(this);
  }

  render() {
    const call = getState('active-call') || {};
    const title = call.title || 'Overview of new real estate proposals';
    const badge = call.badge || 'Team';
    const invited = call.invitedCount ?? 6;
    const absent = call.absentCount ?? 2;

    return `
      <header class="call-header">
        <div class="left">
          <button class="back" id="vf-back" type="button" aria-label="Back">
            <span class="switch_icon_arrow_left"></span>
          </button>
          <div class="title-wrap">
            <div class="title-row">
              <h1>${escapeHtml(title)}</h1>
              <vf-badge data="${createProps({ label: badge, tone: 'neutral' })}"></vf-badge>
            </div>
            <div class="stats">
              <span class="stat invited">Invited to the call: <strong>${invited}</strong></span>
              <span class="stat absent">Absent people: <strong>${absent}</strong></span>
            </div>
          </div>
        </div>
        <vf-button data="${createProps({ id: 'vf-add-user', label: '+ Add user to the call', variant: 'primary' })}"></vf-button>
      </header>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfCallHeader);
