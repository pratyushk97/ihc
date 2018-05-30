/*
 * display when a component called an async service we want to show a loading
 * indicator for
 */
import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import {localData} from '../services/DataService';

export default class Loading extends Component<{}> {
  /*
   * props:
   * patientKey: the patientKey to mark as upload in case loading is canceled,
   *   or null if not needed
   * setErrorMsg: function to set error msg if cancel button is clicked
   *   or null if not needed
   * cancelLoading: function to turn off loading
   */
  constructor(props) {
    super(props);
  }

  cancel = () => {
    if(this.props.patientKey) {
      localData.markPatientNeedToUpload(this.props.patientKey);
      // TODO: Display a Retry button? Basically same as UploadUpdates
    }

    if(this.props.setErrorMsg) {
      this.props.setErrorMsg('Cancelled. May need to retry.');
    }

    this.props.cancelLoading();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
        <ActivityIndicator size="large" />
        <Button title="Cancel" onPress={this.cancel} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    margin: 4
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#F5FCFF'
  },
});
