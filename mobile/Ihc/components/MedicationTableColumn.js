import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  Text,
  View,
  ScrollView
} from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

/*
 * Takes in all the updates for a given date to create a column for it
 * Column expects rows to be in same order as they are passed through the
 * drugNames array. Should only be one drug of a given name in the array
 * (because otherwise should be in another column)
 */
export default class MedicationTableColumn extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *    updates: [DrugUpdate, DrugUpdate, ...],
   *    drugNames: ['name1', 'name2',...]
   *  }
   */
  constructor(props) {
    super(props);
  }

  render() {
    // Render row for header, then render all the rows
    return (
      <ScrollView contentContainerStyle={tableStyles.scroller}>
        <Grid>
          <Row>{this.props.updates[0].date}</Row>
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
