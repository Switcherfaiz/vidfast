export function send(ws, payload) {
  if (ws?.readyState === 1) ws.send(JSON.stringify(payload));
}

export function broadcast(room, payload, exceptWs = null) {
  for (const socket of room.peers.keys()) {
    if (socket !== exceptWs) send(socket, payload);
  }
}
