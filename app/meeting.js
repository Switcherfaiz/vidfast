import { SwitchComponent, getState, updateState, useState } from 'switch-framework';
import { navigate } from 'switch-framework/router';

const DEFAULT_PARTICIPANTS = [
  { name: 'Lubava Zabava', muted: false, isMain: true },
  { name: 'Daniel Markham', muted: true },
  { name: 'Olivia Forest', muted: true }
];

export class SwMeetingScreen extends SwitchComponent {
  static screenName = 'meeting';
  static path = '/meeting';
  static title = 'Meeting';
  static tag = 'sw-meeting-screen';
  static layout = 'stack';
  static { this.useState('meeting-participants'); this.useState('meeting-muted'); }

  onMount() {
    this.listener('#cancel_btn', 'click', () => this.handleCancel());
    this.listener('#mute_btn', 'click', () => this.toggleMute());
    this.listener('#back_btn', 'click', () => navigate('index'));
    this.listener('#records_back', 'click', () => navigate('index'));
  }

  handleCancel() {
    if (confirm('End meeting for everyone?')) {
      navigate('index');
    }
  }

  toggleMute() {
    updateState('meeting-muted', (v) => !v);
  }

  getParticipants() {
    const count = getState('meeting-participants') || 3;
    const names = ['Lubava Zabava', 'Daniel Markham', 'Olivia Forest', 'Alex Chen', 'Sam Wilson'];
    return Array.from({ length: Math.min(count, 5) }, (_, i) => ({
      name: names[i] || `Participant ${i + 1}`,
      muted: i > 0,
      isMain: i === 0
    }));
  }

  getGridClass() {
    const count = getState('meeting-participants') || 3;
    if (count === 1) return 'grid-1';
    if (count === 2) return 'grid-2';
    if (count === 3) return 'grid-3';
    if (count === 4) return 'grid-4';
    return 'grid-4';
  }

  render() {
    const participants = this.getParticipants();
    const gridClass = this.getGridClass();
    const muted = getState('meeting-muted') ?? false;
    const meetingTitle = getState('meeting-title') || 'Product Team Meeting';
    const meetingSubtitle = getState('meeting-subtitle') || 'Record of meeting of this topic and here.';

    const videoItems = participants.map(
      (p, i) => `
      <div class="video-tile ${p.isMain ? 'main' : ''}">
        <div class="video-placeholder">
          ${p.isMain ? '<div class="recording-badge"><span class="rec-dot"></span> Recording</div>' : ''}
          ${!p.isMain ? '<button class="more-btn"><span class="switch_icon_ellipsis_vertical"></span></button>' : ''}
          <div class="participant-name">${this.escapeHtml(p.name)}</div>
          <div class="mic-btn ${p.muted ? 'muted' : ''}">
            <span class="switch_icon_microphone${p.muted ? '_slash' : ''}"></span>
          </div>
        </div>
      </div>
    `
    ).join('');

    return `
      <div class="wrap">
        <button id="back_btn" class="back-btn">
          <span class="switch_icon_arrow_left"></span> Back
        </button>

        <div class="meeting-window">
          <div class="meeting-header">
            <div class="header-left">
              <div class="video-icon-wrap">
                <span class="switch_icon_video"></span>
              </div>
              <div>
                <h2 class="meeting-title">${this.escapeHtml(meetingTitle)}</h2>
                <p class="meeting-subtitle">${this.escapeHtml(meetingSubtitle)}</p>
              </div>
            </div>
            <button id="cancel_btn" class="cancel-btn">Cancel Now</button>
          </div>

          <div class="video-grid ${gridClass}">
            ${videoItems}
          </div>

          <div class="control-bar">
            <button class="ctrl-btn"><span class="switch_icon_arrow_rotate_left"></span></button>
            <button class="ctrl-btn"><span class="switch_icon_play"></span></button>
            <button class="ctrl-btn"><span class="switch_icon_forward"></span></button>
            <div class="ctrl-divider"></div>
            <button id="mute_btn" class="ctrl-btn ${muted ? 'active' : ''}">
              <span class="switch_icon_microphone${muted ? '_slash' : ''}"></span>
              Mute
            </button>
            <button class="ctrl-btn"><span class="switch_icon_gear"></span></button>
          </div>
        </div>

        <div class="glass-panel share-panel">
          <h4>Share Project</h4>
          <p>FigJam file</p>
          <p class="url">figjam.com</p>
        </div>

        <div class="glass-panel notes-panel">
          <h4>Notes</h4>
          <p class="note"><span class="ts">0:12</span> Meeting started</p>
          <p class="note"><span class="ts">1:30</span> Discussing Q1 roadmap</p>
          <button class="analyze-btn"><span class="switch_icon_wand_magic_sparkles"></span> Start Analyze Notes</button>
        </div>

        <div class="glass-panel records-panel">
          <h4>More Records</h4>
          <p>Dev's Zoom • 4 participants</p>
          <p>Markus Downie Presentation</p>
          <a href="#" data-route="index" class="back-link">&lt; Back to Dashboard</a>
        </div>
      </div>
    `;
  }

  escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  styleSheet() {
    return `
      <style>
        @import '/assets/icons/style.css';

        :host {
          display: block;
          width: 100%;
          min-height: 100vh;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #e8eaef 0%, #d1d5db 100%);
          position: relative;
        }

        * { box-sizing: border-box; }

        .wrap {
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          grid-template-rows: auto 1fr;
          gap: 20px;
          align-items: start;
        }

        .back-btn {
          grid-column: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .meeting-window {
          grid-column: 2;
          grid-row: 1 / -1;
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.06);
          max-width: 900px;
          min-width: 560px;
          display: flex;
          flex-direction: column;
        }

        .meeting-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .video-icon-wrap {
          width: 44px;
          height: 44px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-icon-wrap .switch_icon_video {
          font-size: 22px;
          color: #64748b;
        }

        .meeting-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 2px;
        }

        .meeting-subtitle {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        .cancel-btn {
          padding: 10px 20px;
          background: #FF4D4D;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .cancel-btn:hover {
          opacity: 0.9;
        }

        .video-grid {
          flex: 1;
          display: grid;
          gap: 12px;
          padding: 16px;
          min-height: 320px;
        }

        .video-grid.grid-1 {
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
        }

        .video-grid.grid-2 {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr;
        }

        .video-grid.grid-3 {
          grid-template-columns: 1.2fr 1fr;
          grid-template-rows: 1fr 1fr;
        }

        .video-grid.grid-3 .video-tile.main {
          grid-row: span 2;
        }

        .video-grid.grid-4 {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }

        .video-tile {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #1a1a2e;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          min-height: 120px;
          background: linear-gradient(135deg, #2d2d44 0%, #1a1a2e 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-placeholder::before {
          content: '';
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
        }

        .recording-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(0,0,0,0.5);
          border-radius: 8px;
          font-size: 12px;
          color: white;
        }

        .rec-dot {
          width: 8px;
          height: 8px;
          background: #FF4D4D;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .more-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.4);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .more-btn .switch_icon_ellipsis_vertical { font-size: 16px; }

        .participant-name {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 8px 14px;
          background: rgba(0,0,0,0.6);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: white;
        }

        .mic-btn {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .mic-btn .switch_icon_microphone,
        .mic-btn .switch_icon_microphone_slash { font-size: 16px; }

        .mic-btn.muted {
          background: rgba(255, 77, 77, 0.6);
        }

        .control-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          margin: 0 24px 24px;
          background: rgba(0,0,0,0.6);
          border-radius: 999px;
          backdrop-filter: blur(10px);
        }

        .ctrl-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: transparent;
          border: none;
          color: white;
          font-size: 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .ctrl-btn:hover {
          background: rgba(255,255,255,0.15);
        }

        .ctrl-btn .switch_icon_video,
        .ctrl-btn .switch_icon_microphone,
        .ctrl-btn .switch_icon_microphone_slash,
        .ctrl-btn .switch_icon_gear,
        .ctrl-btn .switch_icon_play,
        .ctrl-btn .switch_icon_arrow_rotate_left,
        .ctrl-btn .switch_icon_forward { font-size: 18px; }

        .ctrl-divider {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.3);
          margin: 0 8px;
        }

        .glass-panel {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }

        .share-panel {
          grid-row: 2;
          max-width: 220px;
        }

        .notes-panel {
          grid-column: 3;
          grid-row: 1 / -1;
          max-width: 240px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .records-panel {
          grid-row: 2;
          max-width: 220px;
        }

        .glass-panel h4 {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin: 0 0 12px;
        }

        .glass-panel p {
          font-size: 14px;
          color: #475569;
          margin: 0 0 8px;
        }

        .url { font-family: monospace; font-size: 12px; }
        .note .ts { color: #8A5CF5; font-weight: 600; margin-right: 8px; }

        .analyze-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #8A5CF5;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: auto;
        }

        .back-link {
          font-size: 14px;
          color: #8A5CF5;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-top: 12px;
          text-align: left;
          font-family: inherit;
        }

        @media (max-width: 1200px) {
          .share-panel, .records-panel, .notes-panel { display: none; }
          .wrap { grid-template-columns: 1fr; justify-items: center; }
          .meeting-window { grid-column: 1; min-width: 100%; }
        }
      </style>
    `;
  }
}
