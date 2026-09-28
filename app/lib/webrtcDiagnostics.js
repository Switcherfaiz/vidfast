import { getState, updateState } from 'switch-framework';

const MAX_ENTRIES = 200;

export function rtcLog(scope, message, details = {}) {
  const entry = {
    at: Date.now(),
    scope: String(scope || 'rtc'),
    message: String(message || ''),
    details: sanitize(details)
  };
  const previous = getState('webrtc-diagnostics') || { status: 'idle', transport: 'unknown', entries: [] };
  updateState('webrtc-diagnostics', {
    ...previous,
    entries: [...(previous.entries || []), entry].slice(-MAX_ENTRIES)
  });
  console.info(`[vf:${entry.scope}] ${entry.message}`, entry.details);
  return entry;
}

export function setRtcStatus(status, patch = {}) {
  const previous = getState('webrtc-diagnostics') || { entries: [] };
  updateState('webrtc-diagnostics', { ...previous, status, ...patch });
}

export function diagnosticsText() {
  const state = getState('webrtc-diagnostics') || {};
  const header = JSON.stringify({
    generatedAt: new Date().toISOString(),
    status: state.status || 'idle',
    transport: state.transport || 'unknown',
    online: navigator.onLine,
    userAgent: navigator.userAgent
  }, null, 2);
  const lines = (state.entries || []).map((entry) =>
    `${new Date(entry.at).toISOString()} [${entry.scope}] ${entry.message} ${JSON.stringify(entry.details || {})}`
  );
  return `${header}\n\n${lines.join('\n')}`;
}

function sanitize(value) {
  if (!value || typeof value !== 'object') return value;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_) {
    return { value: String(value) };
  }
}
