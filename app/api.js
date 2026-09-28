const API = '/api';

async function parse(res) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || json.message || `Request failed (${res.status})`);
  return json;
}

function request(path, options = {}) {
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  }).then(parse);
}

export function apiGet(path) {
  return request(path);
}

export function apiSend(path, method, body) {
  return request(path, { method, body: body == null ? undefined : JSON.stringify(body) });
}

export function createRoom(title, password = '') {
  return apiSend('/rooms', 'POST', { title, password });
}

export function fetchRoom(code) {
  return apiGet(`/rooms/${encodeURIComponent(code)}`);
}

export function lockRoom(code, password) {
  return apiSend(`/rooms/${encodeURIComponent(code)}/password`, 'POST', { password });
}
