import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { Room } from '../models/Room.js';

const rooms = new Map();
const scrypt = promisify(crypto.scrypt);

function makeCode() {
  const hex = crypto.randomBytes(9).toString('hex');
  return `${hex.slice(0, 6)}-${hex.slice(6, 12)}-${hex.slice(12, 18)}`;
}

export function publicRoom(room) {
  if (!room) return null;
  return {
    id: room.code,
    code: room.code,
    title: room.title,
    hasPassword: Boolean(room.passwordHash),
    peerCount: room.peers.size,
    hostId: room.hostId || null
  };
}

export async function createRoom(title = 'VidFast meeting', password = '') {
  let code;
  do {
    code = makeCode();
  } while (rooms.has(code) || await Room.exists({ code }));
  const passwordHash = await hashPassword(password);
  const record = await Room.create({
    code,
    title: String(title || 'VidFast meeting').trim() || 'VidFast meeting',
    passwordHash
  });
  const room = {
    code: record.code,
    title: record.title,
    passwordHash: record.passwordHash,
    hostId: '',
    peers: new Map(),
    createdAt: record.createdAt?.getTime?.() || Date.now()
  };
  rooms.set(code, room);
  return room;
}

export async function getRoom(code) {
  const normalized = String(code || '').trim().toLowerCase();
  if (!normalized) return null;
  const live = rooms.get(normalized);
  if (live) return live;
  const record = await Room.findOne({ code: normalized }).lean();
  if (!record) return null;
  const room = {
    code: record.code,
    title: record.title,
    passwordHash: record.passwordHash || '',
    hostId: '',
    peers: new Map(),
    createdAt: record.createdAt?.getTime?.() || Date.now()
  };
  rooms.set(normalized, room);
  return room;
}

export async function setRoomPassword(room, password) {
  const passwordHash = await hashPassword(password);
  room.passwordHash = passwordHash;
  await Room.updateOne({ code: room.code }, { $set: { passwordHash } });
  return room;
}

export async function verifyRoomPassword(room, password) {
  if (!room?.passwordHash) return true;
  const [salt, expected] = String(room.passwordHash).split(':');
  if (!salt || !expected) return false;
  const actual = await scrypt(String(password || ''), salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  return expectedBuffer.length === actual.length && crypto.timingSafeEqual(expectedBuffer, actual);
}

async function hashPassword(password) {
  const value = String(password || '').trim();
  if (!value) return '';
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scrypt(value, salt, 64);
  return `${salt}:${derived.toString('hex')}`;
}

export function addPeer(room, ws, peer) {
  room.peers.set(ws, peer);
  if (!room.hostId) room.hostId = peer.id;
  return peer;
}

export function removePeer(ws) {
  for (const [code, room] of rooms) {
    if (!room.peers.has(ws)) continue;
    const peer = room.peers.get(ws);
    room.peers.delete(ws);
    if (room.hostId === peer.id) {
      const next = [...room.peers.values()][0];
      room.hostId = next?.id || '';
    }
    if (room.peers.size === 0) rooms.delete(code);
    return { room, peer, empty: room.peers.size === 0 };
  }
  return null;
}

export function peerList(room, exceptId = '') {
  return [...room.peers.values()]
    .filter((p) => p.id !== exceptId)
    .map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      muted: !!p.muted,
      cameraOn: p.cameraOn !== false,
      backdrop: p.backdrop || 'none'
    }));
}

export function findPeer(room, id) {
  for (const peer of room.peers.values()) {
    if (peer.id === id) return peer;
  }
  return null;
}

export function findSocket(room, id) {
  for (const [ws, peer] of room.peers) {
    if (peer.id === id) return ws;
  }
  return null;
}
