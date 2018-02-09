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
      dateToUpdates: {},
      drugNames: new Set(),
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

  refillMedication = (prevDrugUpdate) => {
    // TODO get date in whatever format we end up choosing
    // also ensure an update for that date doesn't already exist
    const date = '20180303';
    const newUpdate = Object.assign({}, prevDrugUpdate);
    newUpdate.date = date;
    const oldUpdates = this.state.updates;
    oldUpdates.push(newUpdate);
    const oldDateToUpdates = this.state.dateToUpdates;
    if( date in oldDateToUpdates ) {
      oldDateToUpdates[date].push(newUpdate);
    } else {
      oldDateToUpdates[date] = [newUpdate];
    }

    this.setState({
      updates: oldUpdates,
      dateToUpdates: oldDateToUpdates,
    });
  }

  // TODO buttons
  changeMedication = (prevDrugUpdate) => {
  }

  discontinueMedication = (prevDrugUpdate) => {
  }

  createNewMedication = () => {
  }

  loadMedications = () => {
    this.setState({ loading: true });
    data.getMedicationUpdates()
      .then( updates => {
        const dateToUpdates = {};
        const drugNames = new Set();

        updates.forEach( (update) => {
          if(update.date in dateToUpdates) {
            dateToUpdates[update.date].push(update);
          } else{
            dateToUpdates[update.date] = [update];
          }

          drugNames.add(update.name);
        });

        this.setState({updates: updates, dateToUpdates: dateToUpdates,
          drugNames: drugNames, loading: false});
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  componentDidMount() {
    this.loadMedications();
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
            updates={this.state.updates}
            dateToUpdates={this.state.dateToUpdates}
            drugNames={this.state.drugNames}
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
