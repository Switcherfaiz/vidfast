import { getState, updateState } from 'switch-framework';
import { navigate } from 'switch-framework/router';
import { patchCallControls } from '../../app/api.js';

export function bindControls(host) {
  host.listener('#vf-mute', 'click', async () => {
    const prev = getState('call-controls') || {};
    const muted = !prev.muted;
    updateState('call-controls', { ...prev, muted });
    const call = getState('active-call');
    if (call?.id) {
      try { await patchCallControls(call.id, { muted }); } catch (_) {}
    }
  });

  host.listener('#vf-camera', 'click', async () => {
    const prev = getState('call-controls') || {};
    const cameraOn = !prev.cameraOn;
    updateState('call-controls', { ...prev, cameraOn });
    const call = getState('active-call');
    if (call?.id) {
      try { await patchCallControls(call.id, { cameraOn }); } catch (_) {}
    }
  });

  host.listener('#vf-end', 'click', () => {
    if (confirm('End call for everyone?')) navigate('index');
  });
}
