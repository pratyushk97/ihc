import { Navigation } from 'react-native-navigation';

import WelcomeScreen from './WelcomeScreen';
import SigninScreen from './SigninScreen';
import NewPatientScreen from './NewPatientScreen';
import PatientSelectScreen from './PatientSelectScreen';
import PatientHomeScreen from './PatientHomeScreen';
import MedicationScreen from './MedicationScreen';
import GrowthChartScreen from './GrowthChartScreen';

// register all screens of the app (including internal ones)
export function registerScreens() {
  // All ID names should be Ihc.<Component Name>
  Navigation.registerComponent('Ihc.WelcomeScreen', () => WelcomeScreen);
  Navigation.registerComponent('Ihc.SigninScreen', () => SigninScreen);
  Navigation.registerComponent('Ihc.PatientSelectScreen', () => PatientSelectScreen);
  Navigation.registerComponent('Ihc.PatientHomeScreen', () => PatientHomeScreen);
  Navigation.registerComponent('Ihc.MedicationScreen', () => MedicationScreen);
  Navigation.registerComponent('Ihc.GrowthChartScreen', () => GrowthChartScreen);
  Navigation.registerComponent('Ihc.NewPatientScreen', () => NewPatientScreen);
}
