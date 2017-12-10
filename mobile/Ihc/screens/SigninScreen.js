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

export default class SigninScreen extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO create signin form
    return (
      <View style={styles.container}>
        <Text style={styles.Signin}>
          Signin
        </Text>
        <Text style={styles.instructions}>
          To get started, edit SigninScreen.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}
