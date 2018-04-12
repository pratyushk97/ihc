import 'react-native';
import React from 'react';
import PatientHistoryScreen from '../screens/PatientHistoryScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import data from '../services/DataService';
import Patient from '../models/Patient';

it('renders correctly', () => {
  sinon.stub(data, 'getPatient').returns(Promise.resolve(Patient.getInstance()));

  const json = renderer.create(
    <PatientHistoryScreen todayDate = '20180101' />
  ).toJSON();
  expect(json).toMatchSnapshot();
});
