import { rtcLog } from './diagnostics.js';
import {
  FORCE_RELAY,
  STUN_SERVERS,
  TURN_URLS,
  TURN_USERNAME,
  TURN_CREDENTIAL,
  TURN_URL,
  TURN_USER,
  TURN_PASS
} from '../../../constants/index.js';

export function shouldForceRelay() {
  const override = globalThis.__VF_FORCE_RELAY__;
  if (override === true || override === false) return override;
  if (FORCE_RELAY === true || FORCE_RELAY === false) return FORCE_RELAY;
  return false;
}

function isTurnUri(value) {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === 'string' && /^turns?:/i.test(first.trim());
}

export function getRtcConfiguration({ relayOnly = false } = {}) {
  const iceServers = [
    ...STUN_SERVERS,
    {
      urls: TURN_URLS,
      username: TURN_USERNAME,
      credential: TURN_CREDENTIAL
    }
  ];

  const turnUrl = globalThis.__VF_TURN_URL__ || TURN_URL;
  const turnUser = globalThis.__VF_TURN_USER__ || TURN_USER;
  const turnPass = globalThis.__VF_TURN_PASS__ || TURN_PASS;
  if (turnUrl && turnUser && turnPass) {
    if (!isTurnUri(turnUrl)) {
      rtcLog('ice', 'ignored TURN url — it must be turn: or turns:, not a website', {
        url: String(Array.isArray(turnUrl) ? turnUrl[0] : turnUrl)
      });
    } else {
      iceServers.push({
        urls: turnUrl,
        username: turnUser,
        credential: turnPass
      });
    }
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
