import 'react-native';
import React from 'react';
import PatientHomeScreen from '../screens/PatientHomeScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const json = renderer.create(
    <PatientHomeScreen todayDateString={'Tue Apr 10 2018'} />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
