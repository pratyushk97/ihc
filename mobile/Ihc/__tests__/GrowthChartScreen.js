import 'react-native';
import React from 'react';
import GrowthChartScreen from '../screens/GrowthChartScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import data from '../services/DataService';
import sinon from 'sinon';
import Patient from '../models/Patient';

it('renders correctly', () => {
  sinon.stub(data, 'getPatient').returns(Promise.resolve(Patient.getInstance()));
  const json = renderer.create(
    <GrowthChartScreen />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
