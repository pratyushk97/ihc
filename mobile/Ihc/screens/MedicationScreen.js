import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  CheckBox,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as data from '../services/FakeDataService';
import MedicationTable, {tableStyles} from '../components/MedicationTable';

export default class MedicationScreen extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      updates: [],
      error: null
    };
  }

  backToPatient = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientHomeScreen',
      title: this.props.patientInfo.name,
      passProps: { patientInfo: this.props.patientInfo }
    });
  }

  // TODO when soap screen is made
  goToSoap = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientSelectScreen',
      title: 'Select patient'
    });
  }

  // TODO buttons
  refillMedication = (prevDrugUpdate) => {
  }

  changeMedication = (prevDrugUpdate) => {
  }

  discontinueMedication = (prevDrugUpdate) => {
  }

  createNewMedication = () => {
  }

  render() {
    if(this.props.loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>
            {this.props.patientInfo.name}'s Medications
          </Text>

          <Text>Loading</Text>

          <Button onPress={this.backToPatient}
            title="Back to patient" />
          <Button onPress={this.goToSoap}
            title="To SOAP" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.patientInfo.name}'s Medications
        </Text>

        <MedicationTable style={styles.table} />

        <Button onPress={this.backToPatient}
          title="Back to patient" />
        <Button onPress={this.goToSoap}
          title="To SOAP" />
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
  table: {
  }
});
