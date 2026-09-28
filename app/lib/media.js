import { rtcLog } from './webrtcDiagnostics.js';

const remotes = new Map();
const remoteListeners = new Set();
let localStream = null;
let localVideoEl = null;

export function getLocalStream() {
  return localStream;
}

export async function startLocalMedia({ audio = true, video = true } = {}) {
  if (localStream) {
    attachLocal();
    return localStream;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    const error = new Error('Camera and microphone require HTTPS or localhost.');
    rtcLog('media', 'getUserMedia unavailable', { secureContext: globalThis.isSecureContext });
    throw error;
  }
  rtcLog('media', 'requesting local media', { audio, video, secureContext: globalThis.isSecureContext });
  const media = navigator.mediaDevices.getUserMedia({
    audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
    video: video ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' } : false
  });
  const timed = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Camera or microphone did not start in time.')), 12000);
  });
  try {
    localStream = await Promise.race([media, timed]);
    attachLocal();
    rtcLog('media', 'local media ready', {
      audioTracks: localStream.getAudioTracks().length,
      videoTracks: localStream.getVideoTracks().length
    });
  } catch (error) {
    rtcLog('media', 'local media failed', { name: error?.name, message: error?.message, audio, video });
    throw error;
  }
  return localStream;
}

export function stopLocalMedia() {
  localStream?.getTracks().forEach((t) => t.stop());
  localStream = null;
  if (localVideoEl) localVideoEl.srcObject = null;
}

export function setLocalVideoEl(el) {
  localVideoEl = el;
  attachLocal();
}

function attachLocal() {
  if (localVideoEl && localStream) localVideoEl.srcObject = localStream;
}

export function setRemoteStream(peerId, stream) {
  remotes.set(peerId, stream);
  rtcLog('media', 'remote stream received', {
    peerId,
    audioTracks: stream?.getAudioTracks?.().length || 0,
    videoTracks: stream?.getVideoTracks?.().length || 0
  });
  remoteListeners.forEach((fn) => {
    try { fn(peerId, stream); } catch (_) {}
  });
}

export function onRemoteStreams(fn) {
  remoteListeners.add(fn);
  return () => remoteListeners.delete(fn);
}

export function getRemoteStream(peerId) {
  return remotes.get(peerId) || null;
}

export function getRemotePeerIds() {
  return [...remotes.keys()];
}

export function removeRemoteStream(peerId) {
  remotes.delete(peerId);
}

export function clearRemoteStreams() {
  remotes.clear();
}

export function toggleTrack(kind, enabled) {
  localStream?.getTracks().filter((t) => t.kind === kind).forEach((t) => { t.enabled = enabled; });
  rtcLog('media', 'local track toggled', { kind, enabled });
}

export function applyBackdrop(mode, el = localVideoEl) {
  if (!el) return;
  const filters = {
    none: 'none',
    blur: 'blur(10px) saturate(1.15)',
    dusk: 'sepia(0.3) contrast(1.15) brightness(0.62)',
    ocean: 'hue-rotate(160deg) saturate(1.45) brightness(0.82)'
  };
  el.style.filter = filters[mode] || 'none';
  el.dataset.backdrop = mode || 'none';
}

export function muteRemoteAudio(peerId, muted) {
  const stream = remotes.get(peerId);
  stream?.getAudioTracks().forEach((t) => { t.enabled = !muted; });
}
