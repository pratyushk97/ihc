import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import {localData} from '../services/DataService';
import PatientTable from '../components/PatientTable';
import Container from '../components/Container';

export default class PatientSelectScreen extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      rows: [],
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  loadPatients = () => {
    this.setState({ loading: true });
    const data = localData.getPatientSelectRows();
    this.setState({ rows: data, loading: false });
  }

  // Reload table after moving back to table
  onNavigatorEvent(event) {
    if (event.id === 'willAppear') {
      this.loadPatients();
    }
  }

  componentDidMount() {
    this.loadPatients();
  }

  goToPatient = (patient) => {
    this.props.navigator.push({
      screen: 'Ihc.PatientHomeScreen',
      title: patient.name,
      passProps: { name: patient[0], patientKey: patient[7] }
    });
  }

  render() {
    return (
      <Container loading={this.state.loading}>
        <Text style={styles.title}>
          Select a Patient
        </Text>

        <ScrollView contentContainerStyle={styles.tableContainer} horizontal>
          <PatientTable
            rows={this.state.rows}
            goToPatient={this.goToPatient}
          />
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tableContainer: {
    width: '100%'
  },
});
