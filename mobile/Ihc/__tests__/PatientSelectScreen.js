import 'react-native';
import React from 'react';
import PatientSelectScreen from '../screens/PatientSelectScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const fakeNavigator = { setOnNavigatorEvent: (param) => {} };
  const json = renderer.create(
    <PatientSelectScreen navigator={fakeNavigator} />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
