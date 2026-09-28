import { StackLayout, ensureState, updateState } from 'switch-framework';
import { hydrateGuest } from './lib/session.js';
import { VfSplashScreen } from '../components/VfSplashScreen/index.js';

import { VfIndexScreen } from './index.js';
import { VfIntroScreen } from './intro/index.js';
import { VfJoinScreen } from './join/index.js';
import { VfMeetScreen } from './meet/index.js';
import { VfProfileScreen } from './profile/index.js';
import { VfNotFoundScreen } from './+not-found.js';

import '../components/VfChatPanel/index.js';
import '../components/VfChatHeader/index.js';
import '../components/VfChatTabs/index.js';
import '../components/VfChatThread/index.js';
import '../components/VfThreadBubble/index.js';
import '../components/VfChatComposer/index.js';
import '../components/VfReadyCard/index.js';
import '../components/VfAvatar/index.js';
import '../components/VfProfileSheet/index.js';
import '../components/VfMeetSettingsSheet/index.js';
import '../components/VfPasswordSheet/index.js';
import '../components/VfStageGrid/index.js';

export class VfStackLayout extends StackLayout {
  static tag = 'vf-stack-layout';
  static stackScreens = [
    VfIndexScreen,
    VfIntroScreen,
    VfJoinScreen,
    VfProfileScreen,
    VfMeetScreen,
    VfNotFoundScreen
  ];
  static splash = 'vf-splashscreen';
  static initialRoute = 'index';

  static async init({ renderSplashscreen }) {
    renderSplashscreen('vf-splashscreen');

    const boot = (key, value) => ensureState(key, value);
    boot('user', null);
    boot('active-call', null);
    boot('call-messages', []);
    boot('call-thread-loading', false);
    boot('chat-tab', 'messages');
    boot('chat-open', false);
    boot('call-controls', { muted: false, cameraOn: true, volume: 70, captions: false, hand: false, backdrop: 'none' });
    boot('intro-step', 0);
    boot('meeting-link', '');
    boot('profile-open', false);
    boot('meet-settings-open', false);
    boot('password-prompt-open', false);
    boot('password-prompt-reason', '');
    boot('room-off', null);
    boot('in-room', false);
    boot('ready-dismissed', false);
    boot('focused-peer', null);
    boot('join-status', 'idle');
    boot('join-error', '');
    boot('meeting-password', '');
    boot('webrtc-diagnostics', { status: 'idle', transport: 'unknown', entries: [] });

    const guest = hydrateGuest();
    updateState('user', guest);

    const hasIntro = localStorage.getItem('intro') === 'true';
    return {
      splash: 'vf-splashscreen',
      initialRoute: hasIntro ? 'index' : 'intro'
    };
  }
}
