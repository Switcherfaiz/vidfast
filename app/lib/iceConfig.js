import { rtcLog } from './webrtcDiagnostics.js';

export function shouldForceRelay() {
  if (globalThis.__VF_FORCE_RELAY__ === true) return true;
  if (globalThis.__VF_FORCE_RELAY__ === false) return false;
  return navigator.connection?.type === 'cellular';
}

export function getRtcConfiguration({ relayOnly = false } = {}) {
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.relay.metered.ca:80' },
    {
      urls: [
        'turn:openrelay.metered.ca:80',
        'turn:openrelay.metered.ca:80?transport=tcp',
        'turn:openrelay.metered.ca:443',
        'turn:openrelay.metered.ca:443?transport=tcp',
        'turns:openrelay.metered.ca:443?transport=tcp',
        'turn:standard.relay.metered.ca:80',
        'turn:standard.relay.metered.ca:80?transport=tcp',
        'turn:standard.relay.metered.ca:443',
        'turns:standard.relay.metered.ca:443?transport=tcp',
        'turn:global.relay.metered.ca:80',
        'turn:global.relay.metered.ca:80?transport=tcp',
        'turn:global.relay.metered.ca:443',
        'turns:global.relay.metered.ca:443?transport=tcp'
      ],
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ];

  const turnUrl = globalThis.__VF_TURN_URL__;
  const turnUser = globalThis.__VF_TURN_USER__;
  const turnPass = globalThis.__VF_TURN_PASS__;
  if (turnUrl && turnUser && turnPass) {
    iceServers.push({
      urls: turnUrl,
      username: turnUser,
      credential: turnPass
    });
  }

  const forceRelay = relayOnly || shouldForceRelay();
  rtcLog('ice', 'rtc configuration', {
    relayOnly: forceRelay,
    policy: forceRelay ? 'relay' : 'all',
    host: location.hostname,
    cellular: navigator.connection?.type || 'unknown'
  });

  return {
    iceServers,
    iceTransportPolicy: forceRelay ? 'relay' : 'all',
    iceCandidatePoolSize: 0,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  };
}
