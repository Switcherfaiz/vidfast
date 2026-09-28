import { getState, updateState } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { webrtc } from '../../webrtc/index.js';
import {
  connectSignal,
  disconnectSignal,
  onSignal,
  sendSignal,
  isSignalConnected
} from './functions/socket.js';
import { appendCallMessage, pushOptimisticCallMessage } from './functions/chat.js';
import { emitRoomEvent } from './functions/events.js';
import { hydrateGuest } from '../../../lib/session.js';
import { lockRoom } from '../../../api.js';

let roomLive = false;
let signalRouterReady = false;

export function setRoomUIHandlers() {
  // kept for compatibility — room events drive UI now
}

function pushSystemMessage(text) {
  const prev = getState('call-messages') || [];
  updateState('call-messages', [...prev, {
    id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    type: 'system',
    text,
    at: Date.now()
  }]);
}

function notifyPeersChanged() {
  emitRoomEvent('peers-changed');
  emitRoomEvent('streams-changed');
}

function syncParticipants(peers, hostId) {
  const me = getState('user') || hydrateGuest();
  const controls = getState('call-controls') || {};
  const list = [
    {
      ...me,
      isPublisher: true,
      role: 'You',
      isSelf: true,
      muted: !!controls.muted,
      cameraOn: controls.cameraOn !== false,
      backdrop: controls.backdrop || 'none'
    },
    ...peers.map((p) => ({ ...p, isPublisher: false, role: p.id === hostId ? 'Host' : 'Guest' }))
  ];
  const call = getState('active-call') || {};
  updateState('active-call', { ...call, participants: list, hostId });
  notifyPeersChanged();
}

function remotePeers(exceptId = '') {
  const call = getState('active-call') || {};
  return (call.participants || []).filter((p) => p && !p.isSelf && p.id && p.id !== exceptId);
}

function ensureRemotePeer(peerId, patch = {}) {
  if (!peerId) return;
  const remotes = remotePeers();
  if (remotes.some((p) => p.id === peerId)) return;
  const call = getState('active-call') || {};
  syncParticipants([...remotes, {
    id: peerId,
    name: 'Guest',
    avatar: '',
    muted: false,
    cameraOn: true,
    backdrop: 'none',
    ...patch
  }], call.hostId);
}

const onRemote = (peerId, stream) => {
  ensureRemotePeer(peerId);
  notifyPeersChanged();
};

function handleRoomPeers(msg) {
  if (!roomLive) return;
  syncParticipants(msg.peers || [], msg.hostId || getState('active-call')?.hostId);
}

function handleRoomMessage(msg) {
  if (!msg?.type) return;
  if (!roomLive && msg.type !== 'joined') return;

  if (msg.type === 'room-peers') return handleRoomPeers(msg);

  if (msg.type === 'peer-join') {
    const call = getState('active-call') || {};
    const peers = remotePeers(msg.peer.id);
    syncParticipants([...peers, msg.peer], msg.hostId || call.hostId);
    pushSystemMessage(`${msg.peer.name || 'Someone'} joined the room`);
    webrtc.connectPeer(msg.peer.id, onRemote).catch((error) => {
      webrtc.rtcLog('peer', 'connect to joining peer failed', { peerId: msg.peer.id, message: error?.message });
    });
    return;
  }

  if (msg.type === 'peer-leave') {
    const call = getState('active-call') || {};
    const leaving = (call.participants || []).find((p) => p.id === msg.peerId);
    webrtc.closePeer(msg.peerId);
    syncParticipants(remotePeers(msg.peerId), msg.hostId || call.hostId);
    if (leaving?.name) pushSystemMessage(`${leaving.name} left the room`);
    return;
  }

  if (msg.type === 'peer-update') {
    const call = getState('active-call') || {};
    const me = getState('user') || hydrateGuest();
    const prev = (call.participants || []).find((p) => p.id === msg.peer.id);
    const peers = remotePeers().map((p) => (p.id === msg.peer.id ? { ...p, ...msg.peer } : p));
    if (msg.peer.id === me.id) {
      updateState('user', { ...me, ...msg.peer });
    }
    syncParticipants(peers, call.hostId);
    if (msg.peer.name && prev?.name && prev.name !== msg.peer.name) {
      pushSystemMessage(`${prev.name} is now ${msg.peer.name}`);
    }
    return;
  }

  if (msg.type === 'signal') {
    ensureRemotePeer(msg.from);
    webrtc.handleSignal(msg.from, msg.data, onRemote).catch((error) => {
      webrtc.rtcLog('signal', 'peer signal handling failed', { from: msg.from, name: error?.name, message: error?.message });
    });
    return;
  }

  if (msg.type === 'closed') {
    if (roomLive) {
      webrtc.setRtcStatus('signal-lost');
      updateState('join-error', 'Connection to the meeting server was lost.');
      webrtc.rtcLog('signal', 'room signaling disconnected', { code: msg.code, reason: msg.reason });
    }
    return;
  }

  if (msg.type === 'chat' && msg.message) {
    appendCallMessage(msg.message);
    return;
  }

  if (msg.type === 'kicked') {
    leaveRoom();
    navigate('join');
    return;
  }

  if (msg.type === 'room') {
    const call = getState('active-call') || {};
    updateState('active-call', { ...call, ...msg.room });
    notifyPeersChanged();
  }
}

function ensureSignalRouter() {
  if (signalRouterReady) return;
  signalRouterReady = true;
  onSignal(handleRoomMessage);
}

let enterPromise = null;

export async function enterRoom(code, { password = '' } = {}) {
  if (getState('in-room')) return getState('active-call');
  if (enterPromise) return enterPromise;

  ensureSignalRouter();
  const guest = hydrateGuest();
  const controls = getState('call-controls') || {};
  roomLive = true;

  enterPromise = (async () => {
    try {
      try {
        await webrtc.startLocalMedia({ audio: true, video: controls.cameraOn !== false });
      } catch (error) {
        webrtc.rtcLog('media', 'camera unavailable; trying audio only', { name: error?.name, message: error?.message });
        try {
          await webrtc.startLocalMedia({ audio: true, video: false });
          updateState('call-controls', { ...controls, cameraOn: false });
        } catch (audioError) {
          webrtc.rtcLog('media', 'audio-only capture unavailable', { name: audioError?.name, message: audioError?.message });
          updateState('call-controls', { ...controls, muted: true, cameraOn: false });
        }
      }
      const next = getState('call-controls') || controls;
      if (next.muted) webrtc.toggleTrack('audio', false);
      if (next.cameraOn === false) webrtc.toggleTrack('video', false);

      const joined = await connectSignal({
        room: code,
        password,
        peer: {
          id: guest.id,
          name: guest.name,
          avatar: guest.avatar,
          muted: !!next.muted,
          cameraOn: next.cameraOn !== false,
          backdrop: next.backdrop || 'none'
        }
      });

      updateState('active-call', {
        id: joined.room.code,
        code: joined.room.code,
        title: joined.room.title,
        hasPassword: joined.room.hasPassword,
        hostId: joined.room.hostId,
        participants: []
      });
      updateState('call-messages', []);
      syncParticipants(joined.peers || [], joined.room.hostId);
      updateState('in-room', true);

      webrtc.refreshLocalTracks();
      for (const peer of joined.peers || []) {
        webrtc.connectPeer(peer.id, onRemote).catch((error) => {
          webrtc.rtcLog('peer', 'initial connect failed', { peerId: peer.id, message: error?.message });
        });
      }

      if (!globalThis._vfLeaveBound) {
        globalThis._vfLeaveBound = true;
        globalThis.addEventListener('pagehide', () => leaveRoom());
      }
      return joined;
    } catch (err) {
      roomLive = false;
      throw err;
    } finally {
      enterPromise = null;
    }
  })();
  return enterPromise;
}

export function leaveRoom() {
  roomLive = false;
  updateState('in-room', false);
  updateState('ready-dismissed', false);
  updateState('join-status', 'idle');
  updateState('join-error', '');
  disconnectSignal();
  webrtc.closeAllPeers();
  webrtc.clearRemoteStreams();
  webrtc.stopLocalMedia();
  updateState('call-messages', []);
  updateState('active-call', null);
  notifyPeersChanged();
}

export function broadcastProfile(patch) {
  sendSignal({ type: 'profile', ...patch });
}

export function sendRoomChat(text) {
  const trimmed = String(text || '').trim().slice(0, 2000);
  if (!trimmed || !getState('in-room')) return false;
  pushOptimisticCallMessage(trimmed);
  if (!isSignalConnected()) return true;
  sendSignal({ type: 'chat', text: trimmed });
  return true;
}

export function kickPeer(peerId) {
  sendSignal({ type: 'kick', peerId });
}

export async function setRoomPassword(password) {
  const call = getState('active-call') || {};
  const trimmed = String(password || '').trim();
  const user = getState('user') || {};

  if (getState('in-room')) {
    if (call.hostId && call.hostId !== user.id) {
      throw new Error('Only the host can change the password');
    }
    if (!sendSignal({ type: 'set-password', password: trimmed })) {
      throw new Error('Could not reach the room — try again');
    }
    updateState('active-call', { ...call, hasPassword: Boolean(trimmed) });
    return;
  }

  if (!call.code) throw new Error('Meeting not loaded');
  const { room } = await lockRoom(call.code, trimmed);
  updateState('active-call', { ...call, ...room });
}
