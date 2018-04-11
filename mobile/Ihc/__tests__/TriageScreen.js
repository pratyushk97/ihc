import 'react-native';
import React from 'react';
import TriageScreen from '../screens/TriageScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import data from '../services/DataService';
import Patient from '../models/Patient';
import Triage from '../models/Triage';

it('renders correctly', () => {
  sinon.stub(data, 'getPatient').returns(Promise.resolve(Patient.getInstance()));
  sinon.stub(data, 'getTriage').returns(Promise.resolve(Triage.getInstance()));

  const component = shallow(<TriageScreen />);
  expect(component).toMatchSnapshot();
});
