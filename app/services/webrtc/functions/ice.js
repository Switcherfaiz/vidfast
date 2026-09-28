import { rtcLog } from './diagnostics.js';
import {
  FORCE_RELAY,
  STUN_SERVERS,
  TURN_URLS,
  TURN_USERNAME,
  TURN_CREDENTIAL,
  TURN_URL,
  TURN_USER,
  TURN_PASS,
  TURN_SECRET
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

let cachedTurnAuth = null;

async function hmacSha1Base64(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  let binary = '';
  new Uint8Array(sig).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function dedicatedTurnAuth() {
  if (TURN_USER && TURN_PASS) return { username: TURN_USER, credential: TURN_PASS };
  if (!TURN_SECRET || !globalThis.crypto?.subtle) return null;

  const now = Math.floor(Date.now() / 1000);
  if (cachedTurnAuth && cachedTurnAuth.expiry > now + 3600) return cachedTurnAuth;

  const expiry = now + 12 * 3600;
  const username = `${expiry}:vidfast`;
  const credential = await hmacSha1Base64(TURN_SECRET, username);
  cachedTurnAuth = { username, credential, expiry };
  rtcLog('ice', 'generated TURN credentials', { username });
  return cachedTurnAuth;
}

export async function getRtcConfiguration({ relayOnly = false } = {}) {
  const iceServers = [
    ...STUN_SERVERS,
    {
      urls: TURN_URLS,
      username: TURN_USERNAME,
      credential: TURN_CREDENTIAL
    }
  ];

  const turnUrl = globalThis.__VF_TURN_URL__ || TURN_URL;
  const extraAuth = await dedicatedTurnAuth().catch((error) => {
    rtcLog('ice', 'could not generate TURN credentials', { message: error?.message });
    return null;
  });
  const turnUser = globalThis.__VF_TURN_USER__ || extraAuth?.username;
  const turnPass = globalThis.__VF_TURN_PASS__ || extraAuth?.credential;
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
    cellular: navigator.connection?.type || 'unknown',
    dedicatedTurn: Boolean(turnUrl && turnUser && turnPass)
  });

  return {
    iceServers,
    iceTransportPolicy: forceRelay ? 'relay' : 'all',
    iceCandidatePoolSize: 0,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require'
  };
}
