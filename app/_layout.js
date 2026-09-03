import { StackLayout, createState, updateState, registerComponents } from 'switch-framework';
import { fetchSession, apiSend, apiGet } from './api.js';
import { VfSplashScreen } from '../components/VfSplashScreen/index.js';
import { VfIndexScreen } from './index.js';
import { VfCallScreen } from './call/[id].js';
import { VfLoginScreen } from './login/index.js';
import { VfNotFoundScreen } from './+not-found.js';

import '../components/VfSidebar/index.js';
import '../components/VfCallHeader/index.js';
import '../components/VfMainVideo/index.js';
import '../components/VfTranscriptBar/index.js';
import '../components/VfChatPanel/index.js';
import '../components/VfAvatar/index.js';
import '../components/VfBadge/index.js';
import '../components/VfButton/index.js';

registerComponents([VfSplashScreen]);

export class VfStackLayout extends StackLayout {
  static tag = 'vf-stack-layout';
  static stackScreens = [VfIndexScreen, VfCallScreen, VfLoginScreen, VfNotFoundScreen];
  static splash = 'vf-splashscreen';
  static initialRoute = 'index';

  static async init({ renderSplashscreen }) {
    renderSplashscreen('vf-splashscreen');

    const boot = (key, value) => { try { createState(key, value); } catch (_) {} };
    boot('user', null);
    boot('calls', []);
    boot('active-call', null);
    boot('call-messages', []);
    boot('call-timer', 0);
    boot('sidebar-active', 'calls');
    boot('chat-tab', 'messages');
    boot('call-controls', { muted: false, cameraOn: true, volume: 70 });

    let user = null;
    let calls = [];

    try {
      const session = await fetchSession();
      user = session?.user || null;

      if (!user) {
        const login = await apiSend('/auth/login', 'POST', {
          email: 'kate@vidfast.app',
          password: 'vid123'
        }).catch(() => null);
        user = login?.user || null;
      }

      if (user) {
        const res = await apiGet('/calls').catch(() => ({ calls: [] }));
        calls = Array.isArray(res?.calls) ? res.calls : [];
        if (calls[0]?.id) {
          updateState('active-call', calls[0]);
        }
      }
    } catch (_) {}

    updateState('user', user);
    updateState('calls', calls);

    return {
      splash: 'vf-splashscreen',
      initialRoute: user && calls[0]?.id ? `call/${calls[0].id}` : 'index'
    };
  }
}
