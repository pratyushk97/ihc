import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  ScrollView
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";
import * as data from '../services/FakeDataService';
import MedicationTableColumn from './MedicationTableColumn';

export default class MedicationTable extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *  }
   */
  constructor(props) {
    super(props);
    this.state = {
      dateToUpdates: {},
      drugNames: new Set(),
      updates: []
    }
  }

  componentDidMount() {
    this.setup();
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
    if (!this.state.drugNames || !this.state.dateToUpdates) {
      return (
        <View>
          <Text>No data to show</Text>
        </View>
      )
    }

    const names = Array.from(this.state.drugNames).sort();
    const nameColumn = names.map( (name,i) => {
        return (
          <Row key={`name${i}`}><Text>{name}</Text></Row>
        )
      });


    // Render row for header, then render all the rows
    return (
      <ScrollView contentContainerStyle={tableStyles.scroller}>
        <Grid>
          <Col>
            <Text>Drug name</Text>
            {nameColumn}
          </Col>
        </Grid>
      </ScrollView>
    );
  }
}

/*
 * Files that create a renderRow() function should use these styles for
 * consistency
 */
export const tableStyles = StyleSheet.create({
  scroller: {
    flex: 0,
    minWidth: '80%',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    minWidth: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  rowContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    minHeight: 32
  },
  col: {
    flex: 1,
    alignSelf: 'stretch',
    minWidth: 64
  }
});
