import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  ScrollView,
  View
} from 'react-native';
import {formatDate} from '../util/Date';
var t = require('tcomb-form-native');
var Form = t.form.Form;
import data from '../services/DataService';

export default class NewPatientScreen extends Component<{}> {
  /*
   * Expects
   *  patientInfo: PatientInfo object
   */
  constructor(props) {
    super(props);
    this.state = {success: false, patients: []}
  }

  Gender = t.enums({
    Male: 'Male',
    Female: 'Female',
  });

  Signin = t.struct({
    firstName: t.String,
    motherName: t.String,
    fatherName: t.String,
    birthday: t.Date,
    gender: this.Gender,
    phone: t.maybe(t.String),
  });

  options = {
    fields: {
      motherName: {label: "Mother's last name"},
      fatherName: {label: "Father's last name"},
      birthday: {
        mode: 'date',
        config: {
          format: formatDate,
          dialogMode: 'spinner'
        }
      },
    }
  }

  value = {
    firstName: this.props.patientInfo.firstName,
    motherName: this.props.patientInfo.motherName,
    fatherName: this.props.patientInfo.fatherName,
    birthday: this.props.patientInfo.birthday
  }

  submit = () => {
    if(!this.refs.form.validate().isValid()) {
      return;
    }
    const form = this.refs.form.getValue();
    const patient = Object.assign({}, form);
    // 1 is male, 2 is female
    patient.gender = form.gender === 'Male' ? 1 : 2;
    // TODO: create person, then pop back to blank signin page
    data.createPatient(patient)
        .then( () => {
          this.setState({success: true});
        })
        .catch( (e) => {
          this.setState({success: false});
        });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          New Patient {this.state.patients.length}
        </Text>

        <View>
          <Form ref="form" type={this.Signin}
            style={styles.form}
            options={this.options}
            value={this.value}
          />
          <Button onPress={this.submit}
            title="Submit" />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    alignItems: 'flex-start'
  },
  container: {
    flex: 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
