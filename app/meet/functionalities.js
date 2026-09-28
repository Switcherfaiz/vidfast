import { getState, updateState } from 'switch-framework';
import { webrtc, signaling } from '../services/index.js';

let meetHostRef = null;

export function bindMeeting(host) {
  meetHostRef = host;
  const clock = () => {
    const el = host.select('#meet-clock');
    if (el) el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  clock();
  const clockId = setInterval(clock, 15000);

  host._meetingOff = () => {
    clearInterval(clockId);
    if (meetHostRef === host) meetHostRef = null;
  };

  host.listener('#meet-mute', 'click', () => {
    const prev = getState('call-controls') || {};
    const muted = !prev.muted;
    webrtc.toggleTrack('audio', !muted);
    webrtc.refreshLocalTracks();
    updateState('call-controls', { ...prev, muted });
    if (getState('in-room')) signaling.broadcastProfile({ muted });
  });

  host.listener('#meet-cam', 'click', () => {
    const prev = getState('call-controls') || {};
    const cameraOn = !prev.cameraOn;
    webrtc.toggleTrack('video', cameraOn);
    webrtc.refreshLocalTracks();
    updateState('call-controls', { ...prev, cameraOn });
    if (getState('in-room')) signaling.broadcastProfile({ cameraOn });
  });

  host.listener('#meet-leave', 'click', () => {
    if (getState('in-room')) host._leave();
  });
  host.listener('#meet-join-float', 'click', () => host._enter());
  host.listener('#meet-hint', 'click', () => {
    if (!getState('in-room')) updateState('ready-dismissed', false);
  });
  host.listener('#meet-chat', 'click', () => {
    updateState('meet-settings-open', false);
    updateState('chat-open', getState('chat-open') !== true);
  });
  host.listener('#meet-settings', 'click', () => {
    updateState('chat-open', false);
    updateState('profile-open', false);
    updateState('meet-settings-open', getState('meet-settings-open') !== true);
  });
  host.listener('#meet-profile', 'click', () => {
    updateState('meet-settings-open', false);
    updateState('profile-open', true);
  });

  paintTopbar(host);
}

export function paintTopbar(host) {
  const user = getState('user') || {};
  const name = host.select('#self-name');
  const avatar = host.select('#meet-profile img');
  if (name) name.textContent = user.name || 'You';
  if (avatar && user.avatar) avatar.src = user.avatar;
}

export async function enterFromMeet() {
  if (meetHostRef?._enter) return meetHostRef._enter();
  const host = document.querySelector('vf-meet-screen');
  if (host?._enter) return host._enter();
  throw new Error('Meet screen is not ready yet. Try again in a moment.');
}
