import { getState, updateState } from 'switch-framework';

export function bindVolume(host) {
  host.listener('#vf-volume', 'input', (e) => {
    const volume = Number(e.target.value);
    const prev = getState('call-controls') || {};
    updateState('call-controls', { ...prev, volume });
  });
}
