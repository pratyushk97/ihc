/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';

export default class WelcomeScreen extends Component<{}> {
  constructor(props) {
    super(props);
  }

  goToSignin = () => {
    this.props.navigator.push({
      screen: 'Ihc.SigninScreen',
      title: 'Signin'
    });
  }

  goToSelectPatient = () => {
    this.props.navigator.push({
      screen: 'Ihc.SelectPatientScreen',
      title: 'Select patient'
    });
  }

  sync = () => {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to clinic!
        </Text>
        <Button onPress={this.goToSignin}
          title="Signin"
        />
        <Button onPress={this.goToSelectPatient}
          title="Select Patient"
        />
        <Button onPress={this.sync}
          title="Sync"
        />
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
