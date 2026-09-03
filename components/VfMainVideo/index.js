import { SwitchComponent, getState, createProps, registerComponent } from 'switch-framework';
import '../VfParticipantTile/index.js';
import '../VfVolumeSlider/index.js';
import '../VfVideoControls/index.js';
import '../VfAvatar/index.js';
import { escapeHtml, formatTimer } from '../../app/lib/utils.js';
import { styleSheet } from './stylesheet.js';

export class VfMainVideo extends SwitchComponent {
  static tag = 'vf-main-video';
  static { this.useState('call-timer'); this.useState('active-call'); this.useState('call-controls'); }

  render() {
    const call = getState('active-call') || {};
    const timer = Number(getState('call-timer') ?? call.durationSeconds ?? 0);
    const participants = Array.isArray(call.participants) ? call.participants : [];
    const publisher = participants.find((p) => p.isPublisher) || participants[0] || {};
    const others = participants.filter((p) => !p.isPublisher && p.role !== 'invite');
    const inviteTile = participants.find((p) => p.role === 'invite') || { role: 'invite' };

    const poster = publisher.videoPoster || publisher.avatar || '';
    const name = publisher.name || 'Kate Smith';
    const role = publisher.role || 'Publisher';

    return `
      <div class="main-video">
        <div class="feed" style="background-image:url('${escapeHtml(poster)}')">
          <div class="publisher">
            <vf-avatar data="${createProps({ src: publisher.avatar, name, size: 28 })}"></vf-avatar>
            <div class="pub-meta">
              <span class="role">${escapeHtml(role)}</span>
              <span class="name">${escapeHtml(name)}</span>
            </div>
          </div>
          <div class="timer">
            <span class="dot"></span>
            ${formatTimer(timer)}
          </div>
          <vf-volume-slider></vf-volume-slider>
          <vf-video-controls></vf-video-controls>
        </div>
        <div class="stack">
          ${others.slice(0, 3).map((p) => `
            <vf-participant-tile data="${createProps({
              name: p.name,
              avatar: p.avatar,
              muted: p.muted,
              videoPoster: p.videoPoster || p.avatar
            })}"></vf-participant-tile>
          `).join('')}
          <vf-participant-tile data="${createProps({ invite: true })}"></vf-participant-tile>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}

registerComponent(VfMainVideo);
