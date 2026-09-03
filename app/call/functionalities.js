import { updateState } from 'switch-framework';
import { fetchCall, fetchCallMessages } from '../api.js';

export async function loadCall(id) {
  try {
    const [{ call }, { messages }] = await Promise.all([
      fetchCall(id),
      fetchCallMessages(id)
    ]);
    updateState('active-call', call);
    updateState('call-messages', messages || []);
    updateState('call-timer', call?.durationSeconds || 0);
    updateState('call-controls', {
      muted: !!call?.participants?.find((p) => p.isPublisher)?.muted,
      cameraOn: call?.participants?.find((p) => p.isPublisher)?.cameraOn !== false,
      volume: 70
    });
  } catch (err) {
    console.error(err);
  }
}
