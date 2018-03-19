import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  ScrollView,
  View
} from 'react-native';
var t = require('tcomb-form-native');
var Form = t.form.Form;

import data from '../services/DataService';
import Patient from '../models/Patient';
import Soap from '../models/Soap';
import {stringDate} from '../util/Date';

export default class SoapScreen extends Component<{}> {
  /*
   * Props:
   * name: patient's name for convenience
   * patientKey: string of patient's key
   */
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      success: true,
      error: '',
    }
  }

  // TODO: Make form fields larger, more like textarea
  Soap = t.struct({
    subjective: t.maybe(t.String),
    objective: t.maybe(t.String),
    assessment: t.maybe(t.String),
    plan: t.maybe(t.String),
    wishlist: t.maybe(t.String),
    provider: t.String // Doctor's name
  });

  formOptions = {
    fields: {
      subjective: {
        multiline: true,
      },
      objective: {
        multiline: true,
      },
      assessment: {
        multiline: true,
      },
      plan: {
        multiline: true,
      },
      wishlist: {
        multiline: true,
      },
    }
  }

  // Load existing SOAP info if it exists
  loadFormValues = () => {
    this.setState({ loading: true });
    data.getSoap(this.props.patientKey, stringDate(new Date()))
      .then( soap => {
        this.setState({
          formValues: soap,
          loading: false
        });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.loadFormValues();
  }

  submit = () => {
    if(!this.refs.form.validate().isValid()) {
      return;
    }
    const form = this.refs.form.getValue();

    const soap = Soap.extractFromForm(form, this.props.patientKey);
    data.updateSoap(soap)
        .then( () => {
          this.setState({
            // Clear form, reset to Soap form
            success: true,
            successMsg: `SOAP updated successfully`,
            error: null
          });
        })
        .catch( (e) => {
          this.setState({success: false, error: e.message, successMsg: null});
        });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Soap
        </Text>

        <View style={styles.form}>
          <Form ref="form" type={this.Soap}
            value={this.state.formValues}
            options={this.formOptions}
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
