import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';
import {localData, serverData} from '../services/DataService';
import Loading from '../components/Loading';

export default class WelcomeScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {loading: false, error: null};
  }

  goToSignin = () => {
    this.props.navigator.push({
      screen: 'Ihc.SigninScreen',
      title: 'Signin'
    });
  }

  goToSelectPatient = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientSelectScreen',
      title: 'Select patient'
    });
  }

  upload = () => {
    this.setState({loading: true});
    const patients = localData.getPatientsToUpload();
    serverData.updatePatients(patients)
      .then(() => {
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({error: err.message, loading: false});
      });
  }

  download = () => {
    this.setState({loading: true});
    const lastSynced = localData.lastSynced();
    serverData.getUpdatedPatients(lastSynced)
      .then((patients) => {
        localData.handleDownloadedPatients(patients);
        this.setState({loading: false});
      })
      .catch(err => {
        this.setState({error: err.message, loading: false});
      });
  }

  render() {
    if(this.state.loading) {
      return (
        <Loading />
      );
    }

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
        <Button onPress={this.upload}
          title="Upload updates"
        />
        <Button onPress={this.download}
          title="Download updates"
        />

        <Text style={styles.error}>
          {this.state.error}
        </Text>
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
  error: {
    textAlign: 'center',
    color: 'red',
    margin: 10,
  },
});
