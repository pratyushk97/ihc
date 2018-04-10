import 'react-native';
import React from 'react';
import WelcomeScreen from '../screens/WelcomeScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const json = renderer.create(
    <WelcomeScreen />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
