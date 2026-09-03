const API = '/api';

function redirectToLogin() {
  try { localStorage.removeItem('vf-auth'); } catch (_) {}
  const replaceFn = globalThis.globalStates?.getState?.('replace');
  if (typeof replaceFn === 'function') {
    replaceFn('login', { __url: '/', __lockHistory: true });
  }
}

async function parse(res, path = '') {
  const json = await res.json().catch(() => ({}));
  const authPath = path.includes('/auth/login') || path.includes('/auth/register');
  if (res.status === 401 && !authPath) {
    redirectToLogin();
    throw new Error(json.error || 'Unauthorized');
  }
  if (!res.ok) throw new Error(json.error || json.message || `Request failed (${res.status})`);
  return json;
}

function request(path, options = {}) {
  return fetch(`${API}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  }).then((res) => parse(res, path));
}

export function apiGet(path) {
  return request(path);
}

export function apiSend(path, method, body) {
  return request(path, { method, body: body == null ? undefined : JSON.stringify(body) });
}

export function fetchSession() {
  return apiGet('/auth/me').catch(() => ({ user: null }));
}

export function fetchCall(id) {
  return apiGet(`/calls/${id}`);
}

export function fetchCallMessages(id) {
  return apiGet(`/calls/${id}/messages`);
}

export function sendCallMessage(id, text) {
  return apiSend(`/calls/${id}/messages`, 'POST', { text });
}

export function patchCallControls(id, body) {
  return apiSend(`/calls/${id}/controls`, 'PATCH', body);
}

export function createCall(title) {
  return apiSend('/calls', 'POST', { title });
}
