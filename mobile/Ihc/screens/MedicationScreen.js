import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import data from '../services/DataService';
import MedicationTable, {tableStyles} from '../components/MedicationTable';
import {stringDate} from '../util/Date';

export default class MedicationScreen extends Component<{}> {
  /*
   * Props:
   * name: patient's name for convenience
   * patientKey: string of patient's key
   */
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      updates: [],
      dateToUpdates: {},
      drugNames: new Set(),
      error: null
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  // Reload table after new medication updates
  onNavigatorEvent(event) {
    if (event.id === 'willAppear') {
      this.loadMedications();
    }
  }

  refillMedication = (prevDrugUpdate) => {
    const date = stringDate(new Date());
    const newUpdate = Object.assign({}, prevDrugUpdate);
    newUpdate.date = date;

    data.createDrugUpdate(newUpdate)
      .then( () => {
        this.loadMedications();
        this.setState({error: null});
      })
      .catch( (e) => {
        this.setState({error: e.message});
      });
  }

  // TODO buttons
  changeMedication = (prevDrugUpdate) => {
    this.props.navigator.push({
      screen: 'Ihc.MedicationUpdateScreen',
      title: 'Medication',
      passProps: {
        drugUpdate: prevDrugUpdate,
        action: 'change',
        patientKey: this.props.patientKey,
        name: this.props.name
      }
    });
  }

  discontinueMedication = (prevDrugUpdate) => {
  }

  createNewMedication = () => {
    this.props.navigator.push({
      screen: 'Ihc.MedicationUpdateScreen',
      title: 'Medication',
      passProps: {
        action: 'new',
        patientKey: this.props.patientKey,
        name: this.props.name
      }
    });
  }

  loadMedications = () => {
    this.setState({ loading: true });
    data.getMedicationUpdates(this.props.patientKey)
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
            {this.props.name}'s Medications
          </Text>

          <Text>Loading</Text>

          <View style={styles.footer}>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={this.createNewMedication}>
              <Text style={styles.button}>New Medication</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.name}'s Medications
        </Text>

        <Text>R: Refill, C: Change, D: Discontinue</Text>

        <Text style={styles.error}>
          {this.state.error}
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

        <View style={styles.footer}>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.createNewMedication}>
            <Text style={styles.button}>New Medication</Text>
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
    padding: 0,
  },
  buttonContainer: {
    width: 120,
    height: 30,
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
    flexDirection: 'row',
    maxHeight: 40,
  },
  error: {
    textAlign: 'center',
    color: 'red',
    margin: 0,
  },
});
