import { SwitchComponent, getState, updateState, useEffect, onState } from 'switch-framework';
import { replace, useParams, navigate } from 'switch-framework/router';
import { fetchRoom } from '../api.js';
import { signaling } from '../services/index.js';
import { hydrateGuest } from '../lib/session.js';
import { icon } from '../lib/icons.js';
import { meetingShareUrl } from '../lib/meeting.js';
import { escapeHtml, formatTimer } from '../lib/html.js';
import { styleSheet } from './stylesheet.js';
import { bindMeeting, paintTopbar } from './functionalities.js';
import { requestMeetingPassword } from '../lib/passwordPrompt.js';

export class VfMeetScreen extends SwitchComponent {
  static screenName = 'meet/:id';
  static path = '/meet/:id';
  static title = 'Meeting';
  static tag = 'vf-meet-screen';

  effects() {
    const { id } = useParams();
    useEffect(() => { this._boot(id); }, [id]);
  }

  onMount() {
    bindMeeting(this);
    this._timer = 0;
    this._timerId = setInterval(() => {
      const el = this.select('#call-timer');
      if (!el || !getState('in-room')) return;
      this._timer += 1;
      el.textContent = formatTimer(this._timer);
    }, 1000);

    onState('in-room', () => this._paintRoom());
    onState('ready-dismissed', () => this._paintRoom());
    onState('join-status', () => this._paintRoom());
    onState('active-call', () => this._paintRoom());
    onState('call-controls', () => this._paintControls());
    onState('chat-open', (open) => {
      this.select('.meet')?.classList.toggle('chat-on', open === true);
      this.select('#meet-chat')?.classList.toggle('on', open === true);
    });
    onState('meet-settings-open', (open) => {
      this.select('#meet-settings')?.classList.toggle('on', open === true);
    });
    onState('user', () => paintTopbar(this));
    onState('password-prompt-open', (open) => {
      this.select('#ready-wrap')?.classList.toggle('pw-open', open === true);
    });

    this._roomOff = signaling.onRoomEvent('peers-changed', () => this._paintRoom());

    this._paintRoom();
    this._paintControls();
  }

  onDestroy() {
    clearInterval(this._timerId);
    if (typeof this._roomOff === 'function') this._roomOff();
    if (typeof this._meetingOff === 'function') this._meetingOff();
  }

  _lobbyParticipants() {
    const user = getState('user') || hydrateGuest();
    const controls = getState('call-controls') || {};
    return [{
      ...user,
      isSelf: true,
      role: 'You',
      isPublisher: true,
      muted: !!controls.muted,
      cameraOn: controls.cameraOn !== false
    }];
  }

  async _boot(id) {
    hydrateGuest();
    this._id = id;
    if (!id) return replace('join');
    try {
      const { room } = await fetchRoom(id);
      const prev = getState('active-call') || {};
      updateState('ready-dismissed', false);
      updateState('active-call', {
        ...prev,
        ...room,
        participants: getState('in-room') ? prev.participants : this._lobbyParticipants()
      });
      if (getState('in-room')) return;
      if (room.peerCount > 0) {
        let password = getState('meeting-password') || '';
        if (room.hasPassword && !password) {
          password = await requestMeetingPassword('Enter the password to join this locked room.');
          if (!password) return;
        }
        await signaling.enterRoom(room.code, { password });
        updateState('meeting-password', '');
        updateState('join-status', 'joined');
        updateState('ready-dismissed', true);
        this._hideLobby(true);
      }
    } catch (err) {
      if (err?.needPassword) {
        const typed = await requestMeetingPassword('That password did not work. Try again.');
        if (typed) {
          updateState('meeting-password', typed);
          return this._boot(id);
        }
        return;
      }
      updateState('meeting-link', id);
      replace('join');
    }
  }

  async _askPasswordIfNeeded() {
    const call = getState('active-call') || {};
    let password = getState('meeting-password') || '';
    if (!call.hasPassword) return password;
    if (password) return password;
    password = await requestMeetingPassword('This room is locked. Enter the password to join.');
    return password;
  }

  async _enter() {
    const call = getState('active-call') || {};
    const id = call.code || this._id;
    if (!id) {
      updateState('join-status', 'error');
      updateState('join-error', 'Meeting link is missing.');
      this._paintRoom();
      return;
    }
    if (getState('in-room')) {
      updateState('join-status', 'joined');
      updateState('ready-dismissed', true);
      this._paintRoom();
      return;
    }
    if (getState('join-status') === 'joining') return;

    updateState('join-status', 'joining');
    updateState('join-error', '');
    this._paintRoom();

    try {
      const password = await this._askPasswordIfNeeded();
      if (call.hasPassword && !password) {
        updateState('join-status', 'error');
        updateState('join-error', 'Password required to join.');
        this._paintRoom();
        return;
      }
      await signaling.enterRoom(id, { password });
      if (!getState('in-room')) throw new Error('Could not connect to the room.');
      updateState('meeting-password', '');
      updateState('join-status', 'joined');
      updateState('ready-dismissed', true);
      this._timer = 0;
      this._hideLobby(true);
      setTimeout(() => {
        if (getState('in-room')) updateState('join-status', 'idle');
      }, 3000);
    } catch (err) {
      if (err?.needPassword) {
        updateState('join-status', 'idle');
        updateState('meeting-password', '');
        const typed = await requestMeetingPassword('Incorrect or missing password. Try again.');
        if (typed) {
          updateState('meeting-password', typed);
          return this._enter();
        }
        updateState('join-status', 'error');
        updateState('join-error', 'Password required to join.');
        this._paintRoom();
        return;
      }
      updateState('join-status', 'error');
      updateState('join-error', err?.message || 'Could not join the room.');
      this._paintRoom();
    }
  }

  _leave() {
    updateState('focused-peer', null);
    signaling.leaveRoom();
    navigate('join');
  }

  _hideLobby(force = false) {
    const live = !!getState('in-room');
    const wrap = this.select('#ready-wrap');
    const joinFloat = this.select('#meet-join-float');
    const showLobby = !live && !force && !getState('ready-dismissed');
    if (wrap) {
      wrap.classList.toggle('show', showLobby);
      if (live || force) wrap.classList.remove('show');
    }
    if (joinFloat) joinFloat.hidden = live || !getState('ready-dismissed');
  }

  _paintRoom() {
    const call = getState('active-call') || {};
    const live = !!getState('in-room');
    const dismissed = !!getState('ready-dismissed');
    this.select('.meet')?.classList.toggle('live', live);
    const code = this.select('#meet-code');
    if (code) code.textContent = call.code || this._id || 'getting-ready';
    const share = meetingShareUrl(call.code || call.id).replace(/^https?:\/\//, '');
    const hint = this.select('#meet-hint');
    if (hint) {
      hint.textContent = live
        ? `${(call.participants || []).length} in the room`
        : dismissed
          ? `Tap here to open join options · ${share}`
          : `Share ${share} then join when you are ready`;
    }
    this._hideLobby(live);
    const toast = this.select('#join-toast');
    const joinStatus = getState('join-status');
    if (toast) {
      const showToast = live && (joinStatus === 'joined' || joinStatus === 'idle');
      toast.hidden = !showToast;
      toast.classList.toggle('ok', live);
      toast.classList.toggle('err', joinStatus === 'error');
      if (joinStatus === 'error') toast.textContent = getState('join-error') || 'Could not join.';
      else if (live) toast.textContent = 'You are live in the room';
    }
    const timer = this.select('#timer-wrap');
    if (timer) timer.hidden = !live;
    const leave = this.select('#meet-leave');
    if (leave) leave.hidden = !live;
  }

  _paintControls() {
    const controls = getState('call-controls') || {};
    const muted = !!controls.muted;
    const cameraOn = controls.cameraOn !== false;
    const mute = this.select('#meet-mute');
    const cam = this.select('#meet-cam');
    if (mute) {
      mute.classList.toggle('off', muted);
      mute.innerHTML = muted ? icon('micOff') : icon('mic');
    }
    if (cam) {
      cam.classList.toggle('off', !cameraOn);
      cam.innerHTML = cameraOn ? icon('video') : icon('videoOff');
    }
  }

  render() {
    const { id } = useParams();
    const call = getState('active-call') || {};
    const user = getState('user') || {};
    const shown = call.code || id || 'getting-ready';
    const share = meetingShareUrl(call.code || id || call.id).replace(/^https?:\/\//, '');

    return `
      <div class="meet">
        <div class="topbar">
          <div class="clock" id="meet-clock"></div>
          <div class="code" id="meet-code">${escapeHtml(shown)}</div>
          <div class="timer-wrap" id="timer-wrap" hidden><span class="live-dot"></span><span id="call-timer">00:00</span></div>
          <button class="who" id="meet-profile" type="button" aria-label="Profile">
            <img src="${escapeHtml(user.avatar || '')}" alt="" />
            <span id="self-name">${escapeHtml(user.name || 'You')}</span>
          </button>
        </div>
        <div class="stage">
          <vf-stage-grid></vf-stage-grid>
          <div id="ready-wrap" class="show"><vf-ready-card></vf-ready-card></div>
          <button class="join-float" id="meet-join-float" type="button" hidden>Join now</button>
          <div class="drawer" id="chat-drawer">
            <vf-chat-panel></vf-chat-panel>
          </div>
        </div>
        <div class="bar">
          <button class="ctrl" id="meet-mute" type="button" aria-label="Microphone">${icon('mic')}</button>
          <button class="ctrl" id="meet-cam" type="button" aria-label="Camera">${icon('video')}</button>
          <button class="ctrl" id="meet-chat" type="button" aria-label="Chat">${icon('chat')}</button>
          <button class="ctrl" id="meet-settings" type="button" aria-label="Settings">${icon('gear')}</button>
          <button class="ctrl end" id="meet-leave" type="button" aria-label="End call" hidden>${icon('hangup')}</button>
        </div>
        <button class="hint" id="meet-hint" type="button">Share ${escapeHtml(share)} then join when you are ready</button>
        <div class="join-toast" id="join-toast" hidden role="status">You are live in the room</div>
        <vf-profile-sheet></vf-profile-sheet>
        <vf-meet-settings-sheet></vf-meet-settings-sheet>
        <vf-password-sheet></vf-password-sheet>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}
