import 'react-native';
import React from 'react';
import MedicationUpdateScreen from '../screens/MedicationUpdateScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const json = renderer.create(
    <MedicationUpdateScreen />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
