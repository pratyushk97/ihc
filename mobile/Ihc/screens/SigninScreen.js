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

export default class SigninScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {newPatient: false},
      formType: this.Signin,
      success: true,
      error: '',
    }
  }

  Signin = t.struct({
    firstName: t.String,
    motherName: t.String,
    fatherName: t.String,
    birthday: t.Date,
    newPatient: t.Boolean,
  });

  Gender = t.enums({
    Male: 'Male',
    Female: 'Female',
  });

  // Signin fields + whatever else a new patient needs
  NewPatient = t.struct({
    firstName: t.String,
    motherName: t.String,
    fatherName: t.String,
    birthday: t.Date,
    newPatient: t.Boolean,
    gender: this.Gender,
    phone: t.maybe(t.String),
  });

  options = {
    fields: {
      motherName: {label: "Mother's last name"},
      fatherName: {label: "Father's last name"},
      birthday: {
        label: "Birthday",
        mode: 'date',
        config: {
          format: formatDate,
          dialogMode: 'spinner'
        }
      },
      newPatient: {label: "New patient?"},
    }
  }

  // If new patient button is clicked, then show extra fields
  onFormChange = (value) => {
    if(value.newPatient !== this.state.formValues.newPatient) {
      const type = value.newPatient ? this.NewPatient : this.Signin;
      this.setState({ formValues: value, formType: type });
    }
  }

  submit = () => {
    if(!this.refs.form.validate().isValid()) {
      return;
    }
    const form = this.refs.form.getValue();

    if(form.newPatient) {
      const patient = Object.assign({}, form);
      // 1 is male, 2 is female
      patient.gender = form.gender === 'Male' ? 1 : 2;
      data.createPatient(patient)
          .then( () => {
            this.setState({
              // Clear form, reset to Signin form
              success: true,
              formValues: null,
              formType: this.Signin,
              successMsg: `${patient.firstName} added successfully`
            });
          })
          .catch( (e) => {
            this.setState({success: false, error: e.message});
          });
    } else {
      // TODO: Sign person in, then clear screen
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Signin
        </Text>

        <View style={styles.form}>
          <Form ref="form" type={this.state.formType}
            value={this.state.formValues}
            options={this.options}
            onChange={this.onFormChange}
          />
          <Button onPress={this.submit}
            title="Submit" />

          <Text style={styles.success}>
            {this.state.successMsg}
          </Text>
          <Text style={styles.error}>
            {this.state.error}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    width: '80%',
  },
  container: {
    flex: 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  success: {
    textAlign: 'center',
    color: 'green',
    margin: 10,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    margin: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
