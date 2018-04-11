import 'react-native';
import React from 'react';
import MedicationScreen from '../screens/MedicationScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const fakeNavigator = { setOnNavigatorEvent: (param) => {} };
  const json = renderer.create(
    <MedicationScreen navigator={fakeNavigator} />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
