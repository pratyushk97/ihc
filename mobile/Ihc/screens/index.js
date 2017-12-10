import { Navigation } from 'react-native-navigation';

import WelcomeScreen from './WelcomeScreen';

// register all screens of the app (including internal ones)
export function registerScreens() {
  // All ID names should be Ihc.<Component Name>
  Navigation.registerComponent('Ihc.WelcomeScreen', () => WelcomeScreen);
}
