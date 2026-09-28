import { getState, updateState } from 'switch-framework';
import { webrtc, signaling } from '../../app/services/index.js';
import { escapeHtml } from '../../app/lib/html.js';
import { icon } from '../../app/lib/icons.js';

export function bindStageGrid(host) {
  host._page = 0;
  webrtc.setLocalVideoEl(host.select('#local-video'));
  webrtc.startLocalMedia().then((stream) => {
    if (!stream) {
      const prev = getState('call-controls') || {};
      updateState('call-controls', { ...prev, cameraOn: false });
    }
  }).catch(() => {
    const prev = getState('call-controls') || {};
    updateState('call-controls', { ...prev, cameraOn: false });
  });

  host.listener('#tile-grid', 'click', (e) => {
    const blocked = e.target.closest('.tile.tap-audio');
    if (blocked) {
      blocked.querySelector('video')?.play?.().then(() => blocked.classList.remove('tap-audio')).catch(() => {});
    }
    const btn = e.target.closest('[data-expand]');
    if (btn) {
      const id = btn.dataset.expand;
      if (!id) return;
      const current = getState('focused-peer');
      updateState('focused-peer', current === id ? null : id);
      return;
    }
    const tile = e.target.closest('.tile.minimized');
    if (!tile) return;
    const id = tile.id === 'local-tile' ? 'self' : tile.dataset.peer;
    if (id) updateState('focused-peer', id);
  });
  host.listener('#page-prev', 'click', () => {
    host._page = Math.max(0, (host._page || 0) - 1);
    host.repaint();
  });
  host.listener('#page-next', 'click', () => {
    host._page = (host._page || 0) + 1;
    host.repaint();
  });

  const offPeers = signaling.onRoomEvent('peers-changed', () => host.repaint());
  const offStreams = signaling.onRoomEvent('streams-changed', () => host.attachAllRemotes());
  const unsubRemote = webrtc.onRemoteStreams(() => host.repaint());

  host._gridOff = () => {
    offPeers();
    offStreams();
    unsubRemote();
  };
}

export function paintStageGrid(host) {
  const grid = host.select('#tile-grid');
  if (!grid) return;

  const before = tileRects(grid);
  paintSelfTile(host);

  const call = getState('active-call') || {};
  const others = (call.participants || []).filter((p) => p && !p.isSelf && p.id);
  const keep = new Set(others.map((p) => p.id));
  const focused = getState('focused-peer');
  if (focused && focused !== 'self' && !keep.has(focused)) {
    updateState('focused-peer', null);
    return;
  }

  [...grid.querySelectorAll('[data-peer]')].forEach((el) => {
    if (!keep.has(el.dataset.peer)) {
      el.classList.add('out');
      setTimeout(() => {
        el.remove();
        applyLayout(host, grid, grid.querySelectorAll('.tile').length);
      }, 300);
    }
  });

  others.forEach((p) => {
    let tile = grid.querySelector(`[data-peer="${cssEscape(p.id)}"]`);
    if (!tile) {
      tile = document.createElement('div');
      tile.className = 'tile remote in';
      tile.dataset.peer = p.id;
      tile.innerHTML = `
        <video autoplay playsinline></video>
        <div class="face">${escapeHtml((p.name || 'G').charAt(0))}</div>
        <span class="tag"></span>
        <button class="tile-expand" data-expand="${escapeHtml(p.id)}" type="button" aria-label="Expand">${icon('expand', 14)}</button>
      `;
      grid.appendChild(tile);
      requestAnimationFrame(() => tile.classList.remove('in'));
    } else {
      tile.classList.remove('out');
    }
    const tag = tile.querySelector('.tag');
    if (tag) tag.textContent = p.name || 'Guest';
    const face = tile.querySelector('.face');
    if (face) face.textContent = (p.name || 'G').charAt(0);
    tile.classList.toggle('off', p.cameraOn === false);
    const media = webrtc.getPeerMediaState(p.id);
    const connected = media.connection === 'connected' || media.ice === 'connected' || media.ice === 'completed';
    tile.classList.toggle('connecting', !connected && media.connection !== 'failed' && media.ice !== 'failed');
    tile.classList.toggle('failed', media.connection === 'failed' || media.ice === 'failed');
    attachRemote(host, p.id, tile);
    webrtc.applyBackdrop(p.backdrop || 'none', tile.querySelector('video'));
  });

  ensureSelfExpand(host);

  const count = 1 + others.length;
  applyLayout(host, grid, count);
  paintFocus(host);
  applyPagination(host, grid, count);
  animateLayout(grid, before);
  attachAllRemotes(host);
}

function layoutFor(count, width, height) {
  const portrait = height > width * 1.12;
  if (count <= 1) return { cols: 1, rows: 1, mode: 'solo' };
  if (count === 2) return portrait
    ? { cols: 1, rows: 2, mode: 'gallery' }
    : { cols: 2, rows: 1, mode: 'gallery' };
  if (count <= 4) return { cols: 2, rows: 2, mode: 'gallery' };
  if (count <= 6) return portrait
    ? { cols: 2, rows: 3, mode: 'gallery' }
    : { cols: 3, rows: 2, mode: 'gallery' };
  return { cols: 3, rows: 3, mode: 'gallery' };
}

function applyLayout(host, grid, count) {
  const { width, height } = host.getBoundingClientRect();
  const layout = layoutFor(Math.min(count, 9), width, height);
  grid.dataset.count = String(count);
  grid.dataset.layout = layout.mode;
  grid.style.setProperty('--cols', String(layout.cols));
  grid.style.setProperty('--rows', String(layout.rows));
}

function applyPagination(host, grid, count) {
  const focused = !!getState('focused-peer');
  const pageSize = 9;
  const pages = Math.max(1, Math.ceil(count / pageSize));
  host._page = Math.min(Math.max(0, host._page || 0), pages - 1);
  const start = host._page * pageSize;
  const page = [...grid.querySelectorAll('.tile')];
  page.forEach((tile, index) => {
    tile.hidden = !focused && (index < start || index >= start + pageSize);
  });
  const nav = host.select('#grid-pages');
  if (nav) nav.hidden = focused || pages <= 1;
  const label = host.select('#page-label');
  if (label) label.textContent = `${host._page + 1} / ${pages}`;
  const prev = host.select('#page-prev');
  const next = host.select('#page-next');
  if (prev) prev.disabled = host._page === 0;
  if (next) next.disabled = host._page >= pages - 1;
}

function tileRects(grid) {
  return new Map([...grid.querySelectorAll('.tile')].map((tile) => [tileKey(tile), tile.getBoundingClientRect()]));
}

function tileKey(tile) {
  return tile.id === 'local-tile' ? 'self' : tile.dataset.peer;
}

function animateLayout(grid, before) {
  requestAnimationFrame(() => {
    grid.querySelectorAll('.tile:not([hidden])').forEach((tile) => {
      const first = before.get(tileKey(tile));
      if (!first) return;
      const last = tile.getBoundingClientRect();
      const x = first.left - last.left;
      const y = first.top - last.top;
      const sx = last.width ? first.width / last.width : 1;
      const sy = last.height ? first.height / last.height : 1;
      if (Math.abs(x) < 1 && Math.abs(y) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
      tile.animate([
        { transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`, transformOrigin: 'top left' },
        { transform: 'none', transformOrigin: 'top left' }
      ], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
  });
}

function paintSelfTile(host) {
  const user = getState('user') || {};
  const controls = getState('call-controls') || {};
  const tag = host.select('#self-tag');
  const face = host.select('#cam-off');
  if (tag) tag.textContent = user.name ? `You · ${user.name}` : 'You';
  if (face) face.textContent = (user.name || 'You').charAt(0);
  host.select('#local-tile')?.classList.toggle('off', controls.cameraOn === false);
  host.select('#cam-off')?.classList.toggle('show', controls.cameraOn === false);
  webrtc.applyBackdrop(controls.backdrop || 'none', host.select('#local-video'));
  paintFocus(host);
}

function ensureSelfExpand(host) {
  const tile = host.select('#local-tile');
  if (!tile || tile.querySelector('[data-expand="self"]')) return;
  tile.insertAdjacentHTML('beforeend', `
    <button class="tile-expand" data-expand="self" type="button" aria-label="Expand">${icon('expand', 14)}</button>
  `);
}

function paintFocus(host) {
  const grid = host.select('#tile-grid');
  if (!grid) return;
  const focused = getState('focused-peer');
  grid.classList.toggle('focus-mode', !!focused);
  grid.querySelectorAll('.tile').forEach((tile) => {
    const id = tile.id === 'local-tile' ? 'self' : tile.dataset.peer;
    tile.classList.toggle('focused', !!focused && id === focused);
    tile.classList.toggle('minimized', !!focused && id !== focused);
  });
}

export function attachAllRemotes(host) {
  const call = getState('active-call') || {};
  const ids = new Set([
    ...(call.participants || []).filter((p) => p && !p.isSelf && p.id).map((p) => p.id),
    ...webrtc.getRemotePeerIds()
  ]);
  ids.forEach((id) => attachRemote(host, id));
}

function attachRemote(host, peerId, tileEl = null) {
  const tile = tileEl || host.select(`[data-peer="${cssEscape(peerId)}"]`);
  const video = tile?.querySelector('video');
  const stream = webrtc.getRemoteStream(peerId);
  if (!video || !stream) return;
  if (video.srcObject !== stream) video.srcObject = stream;
  video.muted = false;
  video.play?.().catch((error) => {
    webrtc.rtcLog('playback', 'remote autoplay blocked', { peerId, name: error?.name, message: error?.message });
    tile?.classList.add('tap-audio');
  });
}

function cssEscape(value) {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return String(value).replace(/"/g, '\\"');
}
