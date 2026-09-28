import * as signalingFunctions from './functions/index.js';
import * as session from './session.js';

export const signaling = {
  ...signalingFunctions,
  ...session
};

export default signaling;
