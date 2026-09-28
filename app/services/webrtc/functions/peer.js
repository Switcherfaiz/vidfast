import { getState } from 'switch-framework';
import { sendSignal } from '../../websocket/signaling/functions/socket.js';
import { getLocalStream, setRemoteStream, removeRemoteStream } from './media.js';
import { getRtcConfiguration, shouldForceRelay } from './ice.js';
import { rtcLog, setRtcStatus } from './diagnostics.js';

const peers = new Map();

function localPeerId() {
  return getState('user')?.id || '';
}

export function isOfferer(peerId) {
  const me = localPeerId();
  if (!me || !peerId) return true;
  return String(me) < String(peerId);
}

function serializeSdp(desc) {
  if (!desc) return null;
  return { type: desc.type, sdp: desc.sdp };
}

function serializeCandidate(candidate) {
  if (!candidate) return null;
  return {
    candidate: candidate.candidate,
    sdpMid: candidate.sdpMid,
    sdpMLineIndex: candidate.sdpMLineIndex,
    usernameFragment: candidate.usernameFragment
  };
}

function addLocalTracks(pc) {
  const stream = getLocalStream();
  if (!pc) return;
  ensureTransceivers(pc);
  if (!stream) return;

  const audio = stream.getAudioTracks()[0];
  const video = stream.getVideoTracks()[0];
  replaceSender(pc, 'audio', audio, pc._audioTx);
  replaceSender(pc, 'video', video, pc._videoTx);
}

function replaceSender(pc, kind, track, transceiver) {
  const sender = transceiver?.sender || pc.getSenders().find((s) => s.track?.kind === kind);
  if (sender) {
    if (track && sender.track !== track) {
      sender.replaceTrack(track).catch((error) => {
        rtcLog('media', 'replaceTrack failed', { kind, message: error?.message });
      });
    }
    return;
  }
  if (track) {
    try {
      pc.addTrack(track, getLocalStream());
    } catch (error) {
      rtcLog('media', 'addTrack failed', { kind, message: error?.message });
    }
  }
}

function ensureTransceivers(pc) {
  if (pc._vfTransceivers) return;
  try {
    pc._audioTx = pc.addTransceiver('audio', { direction: 'sendrecv' });
    pc._videoTx = pc.addTransceiver('video', { direction: 'sendrecv' });
    pc._vfTransceivers = true;
  } catch (error) {
    rtcLog('peer', 'addTransceiver failed', { message: error?.message });
  }
}

async function flushPendingCandidates(pc) {
  const pending = pc._pendingCandidates || [];
  pc._pendingCandidates = [];
  for (const candidate of pending) {
    try {
      await pc.addIceCandidate(candidate ? new RTCIceCandidate(candidate) : null);
    } catch (error) {
      rtcLog('ice', 'queued candidate rejected', { message: error?.message });
    }
  }
}

function wire(pc, peerId, onRemote) {
  pc._onRemote = onRemote;
  pc.onicecandidate = (e) => {
    const candidate = serializeCandidate(e.candidate);
    sendSignal({
      type: 'signal',
      to: peerId,
      data: { candidate, endOfCandidates: !e.candidate }
    });
    if (e.candidate?.candidate) {
      const type = / typ (\w+)/.exec(e.candidate.candidate)?.[1] || 'unknown';
      pc._gathered = pc._gathered || new Set();
      pc._gathered.add(type);
      rtcLog('ice', 'local candidate', { peerId, type, protocol: / (udp|tcp) /i.exec(e.candidate.candidate)?.[1] });
    } else {
      rtcLog('ice', 'candidate gathering complete', {
        peerId,
        types: [...(pc._gathered || [])]
      });
      if (!(pc._gathered || new Set()).has('relay')) {
        rtcLog('ice', 'no TURN relay candidate gathered', { peerId, policy: pc.getConfiguration?.().iceTransportPolicy });
        if (shouldForceRelay() && pc.getConfiguration?.().iceTransportPolicy !== 'relay') {
          rebuildPeer(peerId, onRemote, { relayOnly: true, reason: 'no-relay-candidate' });
        }
      }
    }
  };
  pc.ontrack = (e) => {
    if (!pc._vfRemote) pc._vfRemote = new MediaStream();
    if (e.track && !pc._vfRemote.getTracks().includes(e.track)) {
      pc._vfRemote.addTrack(e.track);
      e.track.onunmute = () => {
        setRemoteStream(peerId, pc._vfRemote);
        onRemote?.(peerId, pc._vfRemote);
      };
    }
    const stream = e.streams?.[0] || pc._vfRemote;
    if (!stream?.getTracks?.().length) return;
    setRemoteStream(peerId, stream);
    onRemote?.(peerId, stream);
    rtcLog('media', 'ontrack', {
      peerId,
      kind: e.track?.kind,
      muted: e.track?.muted,
      readyState: e.track?.readyState
    });
    if (e.track?.muted) {
      rtcLog('media', 'remote track is muted until ICE delivers packets', { peerId, kind: e.track.kind });
    }
  };
  pc.onconnectionstatechange = () => {
    const state = pc.connectionState;
    rtcLog('peer', 'connection state changed', { peerId, state });
    setRtcStatus(state, { peerId });
    onRemote?.(peerId, pc._vfRemote);
    if (state === 'connected') {
      clearTimeout(pc._watchdog);
      inspectSelectedPair(pc, peerId);
    }
    if (state === 'failed') {
      rebuildPeer(peerId, onRemote, { relayOnly: true, reason: 'connection-failed' });
    }
    if (state === 'disconnected') {
      setTimeout(() => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          restartPeerIce(pc, peerId);
        }
      }, 2500);
    }
  };
  pc.oniceconnectionstatechange = () => {
    rtcLog('ice', 'connection state changed', { peerId, state: pc.iceConnectionState });
    if (pc.iceConnectionState === 'failed') {
      rebuildPeer(peerId, onRemote, { relayOnly: true, reason: 'ice-failed' });
    }
  };
  pc.onicegatheringstatechange = () => rtcLog('ice', 'gathering state changed', { peerId, state: pc.iceGatheringState });
  pc.onsignalingstatechange = () => rtcLog('peer', 'signaling state changed', { peerId, state: pc.signalingState });
  clearTimeout(pc._watchdog);
  pc._watchdog = setTimeout(() => {
    if (pc.connectionState === 'connected' || pc.connectionState === 'closed') return;
    if (pc.iceGatheringState === 'gathering') {
      rtcLog('ice', 'still gathering candidates, delaying rebuild', { peerId });
      pc._watchdog = setTimeout(() => {
        if (pc.connectionState === 'connected' || pc.connectionState === 'closed') return;
        rtcLog('ice', 'media path still not connected', { peerId, connection: pc.connectionState, ice: pc.iceConnectionState });
        rebuildPeer(peerId, onRemote, { relayOnly: true, reason: 'watchdog' });
      }, 5000);
      return;
    }
    rtcLog('ice', 'media path still not connected', { peerId, connection: pc.connectionState, ice: pc.iceConnectionState });
    rebuildPeer(peerId, onRemote, { relayOnly: true, reason: 'watchdog' });
  }, 8000);
}

async function makePeerConnection(peerId, onRemote, options = {}) {
  const pc = new RTCPeerConnection(await getRtcConfiguration(options));
  pc._pendingCandidates = [];
  pc._makingOffer = false;
  pc._ignoreOffer = false;
  pc._gathered = new Set();
  pc._relayOnly = !!options.relayOnly;
  peers.set(peerId, pc);
  ensureTransceivers(pc);
  addLocalTracks(pc);
  wire(pc, peerId, onRemote);
  return pc;
}

export function closePeer(peerId) {
  const pc = peers.get(peerId);
  clearTimeout(pc?._watchdog);
  try { pc?.close(); } catch (_) {}
  peers.delete(peerId);
  removeRemoteStream(peerId);
}

export function closeAllPeers() {
  [...peers.keys()].forEach(closePeer);
}

export async function callPeer(peerId, onRemote) {
  if (!peerId) return null;
  if (peers.has(peerId)) {
    addLocalTracks(peers.get(peerId));
    return peers.get(peerId);
  }

  const pc = await makePeerConnection(peerId, onRemote);
  if (isOfferer(peerId)) await sendOffer(pc, peerId, false);
  else rtcLog('peer', 'waiting for remote offer', { peerId });
  return pc;
}

export async function connectPeer(peerId, onRemote) {
  return callPeer(peerId, onRemote);
}

async function acceptOffer(from, data, onRemote) {
  let pc = peers.get(from);
  if (pc && (pc.connectionState === 'failed' || pc.signalingState === 'closed')) {
    const relayOnly = pc._relayOnly;
    closePeer(from);
    pc = await makePeerConnection(from, onRemote, { relayOnly });
  }
  if (!pc) pc = await makePeerConnection(from, onRemote);
  else addLocalTracks(pc);

  const collision = pc._makingOffer || pc.signalingState !== 'stable';
  if (collision && pc.signalingState !== 'have-remote-offer') {
    if (isOfferer(from)) {
      rtcLog('peer', 'ignoring colliding offer; we are the offerer', { from, state: pc.signalingState });
      return;
    }
    rtcLog('peer', 'rolling back for remote offer', { from, state: pc.signalingState });
    try {
      await pc.setLocalDescription({ type: 'rollback' });
    } catch (error) {
      rtcLog('peer', 'rollback failed, recreating', { from, message: error?.message });
      const relayOnly = pc._relayOnly;
      closePeer(from);
      pc = await makePeerConnection(from, onRemote, { relayOnly });
    }
  }

  await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
  await flushPendingCandidates(pc);
  addLocalTracks(pc);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  sendSignal({ type: 'signal', to: from, data: { sdp: serializeSdp(pc.localDescription) } });
  rtcLog('peer', 'sent answer', { from });
}

export async function handleSignal(from, data, onRemote) {
  if (!from || !data) return;

  if (data.sdp?.type === 'offer') {
    rtcLog('signal', 'received offer', { from, sdpBytes: data.sdp.sdp?.length || 0 });
    await acceptOffer(from, data, onRemote);
    return;
  }

  let pc = peers.get(from);
  if (!pc && data.sdp) pc = await makePeerConnection(from, onRemote);
  else if (pc) addLocalTracks(pc);

  if (data.sdp?.type === 'answer' && pc) {
    rtcLog('signal', 'received answer', { from, state: pc.signalingState });
    if (pc.signalingState !== 'have-local-offer') {
      rtcLog('signal', 'ignored answer in unexpected state', { from, state: pc.signalingState });
    } else {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      await flushPendingCandidates(pc);
    }
  }

  if ((data.candidate || data.endOfCandidates) && pc) {
    if (pc.remoteDescription) {
      try {
        await pc.addIceCandidate(data.candidate ? new RTCIceCandidate(data.candidate) : null);
      } catch (error) {
        rtcLog('ice', 'candidate rejected', { from, message: error?.message, candidate: data.candidate?.candidate });
      }
    } else {
      pc._pendingCandidates = pc._pendingCandidates || [];
      pc._pendingCandidates.push(data.candidate || null);
    }
  }
}

export function refreshLocalTracks() {
  peers.forEach((pc) => addLocalTracks(pc));
}

export function getPeerMediaState(peerId) {
  const pc = peers.get(peerId);
  if (!pc) return { connection: 'new', ice: 'new' };
  return {
    connection: pc.connectionState,
    ice: pc.iceConnectionState,
    transport: pc.getConfiguration?.().iceTransportPolicy
  };
}

async function sendOffer(pc, peerId, iceRestart) {
  if (!pc || pc.signalingState === 'closed') return;
  try {
    pc._makingOffer = true;
    addLocalTracks(pc);
    const offer = await pc.createOffer({ iceRestart, offerToReceiveAudio: true, offerToReceiveVideo: true });
    await pc.setLocalDescription(offer);
    if (!sendSignal({ type: 'signal', to: peerId, data: { sdp: serializeSdp(pc.localDescription) } })) {
      throw new Error('Signaling is not connected');
    }
    rtcLog('peer', iceRestart ? 'sent ICE restart offer' : 'sent offer', { peerId, sdpBytes: pc.localDescription?.sdp?.length || 0 });
  } catch (error) {
    rtcLog('peer', 'offer failed', { peerId, iceRestart, name: error?.name, message: error?.message });
    throw error;
  } finally {
    pc._makingOffer = false;
  }
}

function restartPeerIce(pc, peerId) {
  if (pc._restartPending || pc.signalingState === 'closed') return;
  if (!isOfferer(peerId)) {
    rtcLog('ice', 'answerer waiting for ICE restart offer', { peerId });
    return;
  }
  pc._restartPending = true;
  rtcLog('ice', 'starting ICE restart', { peerId });
  Promise.resolve()
    .then(() => pc.restartIce?.())
    .then(() => sendOffer(pc, peerId, true))
    .catch((error) => rtcLog('ice', 'ICE restart failed', { peerId, message: error?.message }))
    .finally(() => { pc._restartPending = false; });
}

function rebuildPeer(peerId, onRemote, { relayOnly = false, reason = '' } = {}) {
  const existing = peers.get(peerId);
  if (!existing || existing._rebuilding) return;
  if (!isOfferer(peerId)) {
    rtcLog('ice', 'answerer keeping connection; offerer will retry', { peerId, reason, state: existing.connectionState });
    return;
  }
  if (relayOnly && existing._relayOnly) {
    restartPeerIce(existing, peerId);
    return;
  }
  existing._rebuilding = true;
  rtcLog('ice', 'rebuilding peer connection', { peerId, relayOnly, reason });
  const handler = onRemote || existing._onRemote;
  try { existing.close(); } catch (_) {}
  peers.delete(peerId);
  makePeerConnection(peerId, handler, { relayOnly }).then((pc) => {
    sendOffer(pc, peerId, false).catch((error) => {
      rtcLog('ice', 'rebuild offer failed', { peerId, message: error?.message });
    });
  }).catch((error) => {
    rtcLog('ice', 'rebuild failed', { peerId, message: error?.message });
  });
}

async function inspectSelectedPair(pc, peerId) {
  try {
    const stats = await pc.getStats();
    let pair = null;
    stats.forEach((report) => {
      if (report.type === 'candidate-pair' && report.state === 'succeeded' && (report.selected || report.nominated)) pair = report;
    });
    if (!pair) return;
    const local = stats.get(pair.localCandidateId);
    const remote = stats.get(pair.remoteCandidateId);
    const transport = local?.candidateType || 'unknown';
    setRtcStatus('connected', { peerId, transport });
    rtcLog('stats', 'selected candidate pair', {
      peerId,
      transport,
      protocol: local?.protocol,
      relayProtocol: local?.relayProtocol,
      remoteType: remote?.candidateType,
      roundTripTime: pair.currentRoundTripTime
    });
  } catch (error) {
    rtcLog('stats', 'could not inspect candidate pair', { peerId, message: error?.message });
  }
}
