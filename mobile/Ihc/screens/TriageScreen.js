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
import Patient from '../models/Patient';
import Triage from '../models/Triage';

export default class TriageScreen extends Component<{}> {
  /**
   * Expected props:
   * patientKey
   */
  constructor(props) {
    super(props);
    const startingFormValues = {labsDone: false, urineTestDone: false};
    this.state = {
      formValues: startingFormValues,
      formType: Triage.getFormType(startingFormValues, 2),
      gender: 2, // 1: male, 2: female
      loading: false,
      error: '',
      disableLabs: false,
      disableUrine: false,
    }
  }

  options = {
    fields: {
      statusClarification: {label: "Status clarification (if picked Other)"},
      pregnancyTest: {label: "Pregnancy test positive?"},
      fasting: {label: "Did this patient fast?"},
      urineTestDone: {label: "Did they take a urine test?"},
      labsDone: {label: "Did they get labs done?"},
    },
  }

  // to set the triage form correctly depending on gender
  loadPatient = () => {
    this.setState({ loading: true });
    data.getPatient(this.props.patientKey)
      .then( data => {
        this.setState({
          formType: Triage.getFormType(this.state.formValues, data.gender),
          gender: data.gender,
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.loadPatient();
  }

  onFormChange = (value) => {
    this.setState({
      formType: Triage.getFormType(value, this.state.gender),
      formValues: value,
    });
  }

  submit = () => {
    if(!this.refs.form.validate().isValid()) {
      return;
    }
    const form = this.refs.form.getValue();

    if(form.newPatient) {
      const patient = Patient.extractFromForm(form);
      data.createPatient(patient)
          .then( () => {
            this.setState({
              // Clear form, reset to Triage form
              formValues: {newPatient: false},
              successMsg: `${patient.firstName} added successfully`,
              error: null
            });
          })
          .catch( (e) => {
            this.setState({error: e.message, successMsg: null});
          });
    } else {
      const patient = Patient.extractFromForm(form);
      data.TriagePatient(patient)
          .then( () => {
            this.setState({
              // Clear form, reset to Triage form
              formValues: {newPatient: false},
              successMsg: `${patient.firstName} signed in successfully`,
            });
          })
          .catch( (e) => {
            this.setState({formValues: form, error: e.message, successMsg: null});
          });
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Triage
        </Text>

        <View style={styles.form}>
          <Form ref="form"
            type={this.state.formType}
            value={this.state.formValues}
            options={this.options}
            onChange={this.onFormChange}
          />

          <Text style={styles.error}>
            {this.state.error}
          </Text>

          <Button onPress={this.submit}
            title="Submit" />

          <Text style={styles.success}>
            {this.state.successMsg}
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
