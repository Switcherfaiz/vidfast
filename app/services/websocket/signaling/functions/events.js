export function emitRoomEvent(name, detail = null) {
  try {
    globalThis.dispatchEvent(new CustomEvent(`vf-${name}`, { detail }));
  } catch (_) {}
}

export function onRoomEvent(name, fn) {
  const handler = (e) => fn(e.detail);
  globalThis.addEventListener(`vf-${name}`, handler);
  return () => globalThis.removeEventListener(`vf-${name}`, handler);
}
