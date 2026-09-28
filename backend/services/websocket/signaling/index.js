import * as signalingFunctions from './functions/index.js';
import { attachSignal } from './attach.js';

export const signaling = {
  ...signalingFunctions,
  attachSignal
};

export default signaling;
