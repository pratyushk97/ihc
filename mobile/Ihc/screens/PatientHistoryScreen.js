import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import data from '../services/DataService';
import Patient from '../models/Patient';

export default class PatientHistoryScreen extends Component<{}> {
  /*
   * Expects:
   *  {
   *    name: string, patient's name (for convenience)
   *    patientKey: string
   *  }
   */
  constructor(props) {
    super(props);
    this.state = {
      patient: {},
      //rows: [],
      soaps: [],
      triages: [],
      loading: false,
      error: null
    };
  }

  loadPreviousVisits = () => {
    this.setState({ loading: true });
    data.getPatient(this.props.patientKey)
      .then( data => {
        this.setState({ patient: data, soaps: data.soaps, triages: data.triages, loading: false });
        //for (i = 0; i < data.soaps.length; i ++) {
          //this.state.rows[i] = data.soaps[i].date;
        //}
      })
      .catch( err => {
        this.setState({ error: err, loading: false });
      });
  }
/*
  loadPreviousVisits = () => {
    this.setState({ loading: true });
    data.getSoap(patientKey, ) 
      .then( data => {
        this.setState({ rows: data, loading: false });
      })
      .catch( err => {
        this.setState({ error: err, loading: false });
      });
  }
*/
  loadAll() {
    this.loadPreviousVisits();
  }

  goToSoap = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientHistoryScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name, patientKey: this.props.patientKey }
    });
  }

  goToTriage = () => { 
    this.props.navigator.push({
      screen: 'Ihc.PatientHistoryScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name, patientKey: this.props.patientKey }
    });
  }
/*
  renderRow = (data, keyFn) => {
    const cols = data.map( (e,i) => (
      <View style={styles.col} key={keyFn(i)}>
        {( () => {
          switch(i) {
            case 1: //date
              return <Text>{e.
            case 2: //soap
            case 3: //traige
          }
        })() }
      </View>
    ) );
  }
*/
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Previous Visits
        </Text>

        <View style={styles.gridContainer}>
          <Grid>
            <Col style={styles.col}>
              <Text>
                {this.state.patient.name}
              </Text>
            </Col>

            <Col style={styles.col}>
              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToSoap}>
                <Text style={styles.button}>SOAP</Text>
              </TouchableOpacity>
            </Col>

            <Col style={styles.col}>
              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToTriage}>
                <Text style={styles.button}>Triage</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    maxWidth: '80%',
    alignItems: 'center',
  },
  col: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  buttonContainer: {
    width: 150,
    margin: 10,
    padding: 8,
    elevation: 4,
    borderRadius: 2,
    backgroundColor: '#2196F3',
  },
  button: {
    fontWeight: '500',
    color: '#fefefe',
    textAlign: 'center',
  }
});
