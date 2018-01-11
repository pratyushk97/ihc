/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';
var t = require('tcomb-form-native');
var Form = t.form.Form;

export default class SigninScreen extends Component<{}> {
  constructor(props) {
    super(props);
  }

  Signin = t.struct({
    firstName: t.String,
    motherName: t.maybe(t.String),
    fatherName: t.maybe(t.String),
    newPatient: t.Boolean
  });

  options = {
    fields: {
      motherName: {label: "Mother's last name"},
      fatherName: {label: "Father's last name"},
      newPatient: {label: "New patient?"}
    }
  }

  goToWelcome = () => {
    this.props.navigator.push({
      screen: 'Ihc.WelcomeScreen',
      title: 'Welcome'
    });
  }

  //TODO
  submit = () => {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Signin
        </Text>

        <View>
          <Form ref="form" type={this.Signin}
            options={this.options}
          />
          <Button onPress={this.submit}
            title="Submit" />
          <Button onPress={this.goToWelcome}
            title="Back to home" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
