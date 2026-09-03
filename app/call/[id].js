import { SwitchComponent, getState, useEffect, useScreenFocus, updateState } from 'switch-framework';
import { useParams } from 'switch-framework/router';
import '../../components/VfSidebar/index.js';
import '../../components/VfCallHeader/index.js';
import '../../components/VfMainVideo/index.js';
import '../../components/VfTranscriptBar/index.js';
import '../../components/VfChatPanel/index.js';
import { styleSheet } from './stylesheet.js';
import { loadCall } from './functionalities.js';

export class VfCallScreen extends SwitchComponent {
  static screenName = 'call/:id';
  static path = '/call/:id';
  static title = 'Call';
  static tag = 'vf-call-screen';
  static layout = 'stack';
  static {
    this.useState('active-call');
    this.useState('call-messages');
    this.useState('call-timer');
    this.useState('sidebar-active');
    this.useState('chat-tab');
    this.useState('call-controls');
  }

  effects() {
    const { id } = useParams();

    useScreenFocus(() => {
      if (id) loadCall(id);
    });

    useEffect(() => {
      if (!id) return;
      loadCall(id);
      const call = getState('active-call');
      let seconds = Number(call?.durationSeconds || 195);
      updateState('call-timer', seconds);
      const timerId = setInterval(() => {
        seconds += 1;
        updateState('call-timer', seconds);
      }, 1000);
      return () => clearInterval(timerId);
    }, [id]);
  }

  render() {
    return `
      <div class="vf-app vf-theme">
        <vf-sidebar></vf-sidebar>
        <main class="main">
          <vf-call-header></vf-call-header>
          <div class="stage">
            <section class="video-area">
              <vf-main-video></vf-main-video>
              <vf-transcript-bar></vf-transcript-bar>
            </section>
            <vf-chat-panel></vf-chat-panel>
          </div>
        </main>
      </div>
    `;
  }

  styleSheet() {
    return styleSheet();
  }
}
