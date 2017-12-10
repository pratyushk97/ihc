import { Navigation } from 'react-native-navigation';

import { registerScreens } from './screens';

registerScreens(); // this is where you register all of your app's screens

// start the app
Navigation.startSingleScreenApp({
  screen: {
    screen: 'Ihc.WelcomeScreen',
    title: 'Welcome',
    navigatorStyle: {},
    navigatorButtons: {}
  },
  passProps: {},
  animationType: 'slide-down'
});
