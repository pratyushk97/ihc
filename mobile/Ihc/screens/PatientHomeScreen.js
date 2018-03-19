import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

export default class PatientHomeScreen extends Component<{}> {
  /*
   * Expects:
   *  {
   *    name: string, patient's name (for convenience)
   *    patientKey: string
   *  }
   */
  constructor(props) {
    super(props);
  }

  // TODO all of these except medications
  goToTriage = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientSelectScreen',
      title: 'Back to patient'
    });
  }

  goToSoap = () => {
    this.props.navigator.push({
      screen: 'Ihc.SoapScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name, patientKey: this.props.patientKey }
    });
  }

  goToMedicationList = () => {
    this.props.navigator.push({
      screen: 'Ihc.MedicationScreen',
      title: 'Back to patient',
      passProps: { name: this.props.name, patientKey: this.props.patientKey }
    });
  }

  goToHistory = () => {
    this.props.navigator.push({
      screen: 'Ihc.PatientSelectScreen',
      title: 'Back to patient',
    });
  }

  goToGrowthChart = () => {
    this.props.navigator.push({
      screen: 'Ihc.GrowthChartScreen',
      title: 'Back to patient',
      passProps: { patientKey: this.props.patientKey}
    });
  }

  render() {
    const date = new Date();
    //const dateString = `${date.getMonth()} ${date.getDate()}, ${date.getYear()}`;
    const dateString = date.toDateString();
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {this.props.name}
        </Text>

        <Text style={styles.title}>
          {dateString}
        </Text>

        <View style={styles.gridContainer}>
          <Grid>
            <Col style={styles.col}>
              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToTriage}>
                <Text style={styles.button}>Triage</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToSoap}>
                <Text style={styles.button}>SOAP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToMedicationList}>
                <Text style={styles.button}>Medications</Text>
              </TouchableOpacity>
            </Col>

            <Col style={styles.col}>
              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToHistory}>
                <Text style={styles.button}>History</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonContainer}
                  onPress={this.goToGrowthChart}>
                <Text style={styles.button}>Growth Chart</Text>
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
