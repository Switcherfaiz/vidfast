import { rtcLog, setRtcStatus } from '../../../webrtc/functions/diagnostics.js';

let socket = null;
const listeners = new Set();

function emit(msg) {
  listeners.forEach((fn) => {
    try { fn(msg); } catch (_) {}
  });
}

export function onSignal(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isSignalConnected() {
  return socket?.readyState === 1;
}

export function sendSignal(payload) {
  if (!isSignalConnected()) {
    rtcLog('signal', 'message dropped: socket not open', { type: payload?.type, signalType: payload?.data?.sdp?.type });
    return false;
  }
  try {
    socket.send(JSON.stringify(payload));
    if (payload?.type === 'signal') {
      rtcLog('signal', 'sent peer signal', { to: payload.to, kind: payload.data?.sdp?.type || (payload.data?.candidate ? 'candidate' : 'unknown') });
    }
    return true;
  } catch (error) {
    rtcLog('signal', 'send failed', { name: error?.name, message: error?.message });
    return false;
  }
}

export function disconnectSignal() {
  try { socket?.close(1000, 'client leave'); } catch (error) {
    rtcLog('signal', 'close failed', { message: error?.message });
  }
  socket = null;
}

export function connectSignal({ room, peer, password = '' }) {
  disconnectSignal();
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${proto}://${location.host}/ws`;
  socket = new WebSocket(url);
  setRtcStatus('signaling');
  rtcLog('signal', 'connecting', { url });

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      rtcLog('signal', 'connection timed out');
      reject(new Error('Signaling timed out'));
    }, 12000);

    socket.onopen = () => {
      rtcLog('signal', 'socket open');
      sendSignal({ type: 'join', room, password, peer });
    };

    socket.onmessage = (ev) => {
      let msg = null;
      try { msg = JSON.parse(ev.data); } catch (error) {
        rtcLog('signal', 'invalid server message', { message: error?.message });
        return;
      }
      if (msg.type === 'joined') {
        clearTimeout(timer);
        setRtcStatus('joined');
        rtcLog('signal', 'joined room', { peers: msg.peers?.length || 0 });
        resolve(msg);
      }
      if (msg.type === 'need-password') {
        clearTimeout(timer);
        disconnectSignal();
        reject(Object.assign(new Error('Password required'), { needPassword: true }));
      }
      if (msg.type === 'error') {
        clearTimeout(timer);
        disconnectSignal();
        reject(new Error(msg.error || 'Signaling error'));
      }
      emit(msg);
    };

    socket.onerror = () => {
      clearTimeout(timer);
      setRtcStatus('signal-error');
      rtcLog('signal', 'socket error');
      reject(new Error('Could not reach signaling'));
    };

    socket.onclose = (event) => {
      rtcLog('signal', 'socket closed', { code: event.code, reason: event.reason, clean: event.wasClean });
      setRtcStatus(event.code === 1000 ? 'closed' : 'signal-lost');
      emit({ type: 'closed', code: event.code, reason: event.reason });
    };
  });
}
