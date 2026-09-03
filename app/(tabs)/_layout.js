import { TabLayout, registerComponents } from 'switch-framework';
import { SwTabBar } from '../../components/SwTabBar.js';
import { SwHomeScreen } from './index.js';
import { SwExploreScreen } from './explore.js';

registerComponents([SwTabBar]);

export class SwTabsLayout extends TabLayout {
  static tag = 'sw-tabs-layout';
  static initialTab = 'home';
  static tabs = [
    {
      name: 'home',
      title: 'Home',
      icon: 'home',
      path: '/home',
      screen: 'sw-home-screen',
      match: ['home'],
      initialRoute: 'home'
    },
    {
      name: 'explore',
      title: 'Explore',
      icon: 'compass',
      path: '/explore',
      screen: 'sw-explore-screen',
      match: ['explore'],
      initialRoute: 'explore'
    }
  ];
  static options = { position: 'bottom' };
  static screens = [SwHomeScreen, SwExploreScreen];

  render() {
    return `
      <div class="layout">
        <div class="tabcontainer"></div>
        <div class="tabbar">
          <sw-tab-bar></sw-tab-bar>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: inherit;
          overflow: hidden;
          font-family: "Poppins", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
          font-family: inherit;
        }

        .layout {
          min-height: 0;
          height: 100%;
          display: grid;
          grid-template-rows: minmax(0, 1fr) auto;
          overflow: hidden;
        }

        .tabbar {
          height: auto;
          position: sticky;
          bottom: 0;
          z-index: 50;
        }

        .tabcontainer {
          z-index: 1;
          min-height: 0;
          overflow: auto;
          overflow-x: hidden;
          padding-bottom: calc(12px + 56px + env(safe-area-inset-bottom, 0px));
        }
      </style>
    `;
  }
}

export default SwTabsLayout;
