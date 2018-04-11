require('react-native-mock/mock'); // Must be first line for tests that include enzyme
import 'react-native';
import React from 'react';
import SigninScreen from '../screens/SigninScreen';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import sinon from 'sinon';
// import data from '../services/DataService';


it('renders correctly for new patient', () => {
//  sinon.stub(data, "createPatient");
//  sinon.stub(data, "signinPatient");
  const component = shallow(<SigninScreen />);
  expect(component).toMatchSnapshot();
  component.setState({formValues: {newPatient: true}});
  expect(component).toMatchSnapshot();
});
