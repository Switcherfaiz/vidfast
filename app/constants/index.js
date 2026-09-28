export const FORCE_RELAY = null;

export const STUN_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
  { urls: 'stun:stun.relay.metered.ca:80' }
];

export const TURN_URLS = [
  'turn:openrelay.metered.ca:80',
  'turn:openrelay.metered.ca:80?transport=tcp',
  'turn:openrelay.metered.ca:443',
  'turn:openrelay.metered.ca:443?transport=tcp',
  'turns:openrelay.metered.ca:443?transport=tcp'
];

export const TURN_USERNAME = 'openrelayproject';
export const TURN_CREDENTIAL = 'openrelayproject';

export const TURN_URL = [
  'turn:staticauth.openrelay.metered.ca:80',
  'turn:staticauth.openrelay.metered.ca:80?transport=tcp',
  'turn:staticauth.openrelay.metered.ca:443',
  'turn:staticauth.openrelay.metered.ca:443?transport=tcp',
  'turns:staticauth.openrelay.metered.ca:443?transport=tcp'
];

export const TURN_SECRET = 'openrelayprojectsecret';
export const TURN_USER = '';
export const TURN_PASS = '';
