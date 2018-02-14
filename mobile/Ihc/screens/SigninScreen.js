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

  //TODO
  submit = () => {
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Signin
        </Text>

        <View>
          <Form ref="form" type={this.Signin}
            style={styles.form}
            options={this.options}
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
