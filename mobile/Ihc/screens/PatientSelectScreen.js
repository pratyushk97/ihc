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
  View,
  List,
  ListItem,
  FlatList
} from 'react-native';
//import { List, ListItem } from 'react-native-elements';
import * as data from '../services/FakeDataService';
import Table from '../components/Table';

export default class PatientSelectScreen extends Component<{}> {
  constructor(props) {
    super(props);

    this.tableHeaders = ['Name', 'Birthday', 'Checkin time', 'Triage', 'Doctor',
            'Pharmacy', 'Notes'];
    this.state = {
      loading: false,
      rows: [],
      error: null
    };
  }

  goToWelcome = () => {
    this.props.navigator.push({
      screen: 'Ihc.WelcomeScreen',
      title: 'Welcome'
    });
  }

  loadPatients = () => {
    this.setState({ loading: true });
    data.getPatientSelectRows()
      .then( data => {
        this.setState({ rows: data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.loadPatients();
  }

  render() {
    if(this.state.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            PatientSelect
          </Text>
          <Text>Loading...</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          PatientSelect
        </Text>

        <Table
          headers={this.tableHeaders}
          rows={this.state.rows}
          loading={this.state.loading}
        />

        <Button onPress={this.goToWelcome}
          title="Back to home" />
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
