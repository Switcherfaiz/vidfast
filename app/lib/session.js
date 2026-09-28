import { updateState } from 'switch-framework';
import { ensureGuest } from './guest.js';

export function hydrateGuest() {
  const guest = ensureGuest();
  updateState('user', guest);
  return guest;
}
