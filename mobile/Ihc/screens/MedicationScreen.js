import React, { Component } from 'react';
import {
  StyleSheet,
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

          <TouchableOpacity onPress={this.createNewMedication}
            title="New Medication" />
          <TouchableOpacity onPress={this.backToPatient}
            title="Back to patient" />
          <TouchableOpacity onPress={this.goToSoap}
            title="To SOAP" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.patientInfo.name}'s Medications
        </Text>

        <View style={styles.tableContainer}>
          <MedicationTable style={styles.table}
            refill={this.refillMedication}
            change={this.changeMedication}
            discontinue={this.discontinueMedication}
           />
        </View>

        <Text>R: Refill, C: Change, D: Discontinue</Text>

        <View style={styles.footer}>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.backToPatient}>
            <Text style={styles.button}>Back to patient</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.createNewMedication}>
            <Text style={styles.button}>New Medication</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.goToSoap}>
            <Text style={styles.button}>To SOAP</Text>
          </TouchableOpacity>
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
    margin: 4,
  },
  tableContainer: {
    maxHeight: '70%',
    maxWidth: '95%',
  },
  buttonContainer: {
    width: 150,
    margin: 4,
    padding: 8,
    elevation: 4,
    borderRadius: 2,
    backgroundColor: '#2196F3',
  },
  button: {
    fontWeight: '500',
    color: '#fefefe',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    flexDirection: 'row'
  }
});
