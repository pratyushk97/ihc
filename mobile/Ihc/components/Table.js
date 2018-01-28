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
import TableRow from './TableRow';

export default class Table extends Component<{}> {
  /*
   * Expects:
   *  {
   *    headers: [string],
   *    rows: [[data]],
   *    loading: boolean,
   *    renderRow: function (custom renderRow fn?)
   *  }
   */
  constructor(props) {
    super(props);
  }

  // TODO: Support for header style, checkable cells, click events
  renderRow(data, keyFn) {
    const cols = data.map( (e,i) => (
      <View style={styles.row} key={keyFn(i)}>
        <Text>{e}</Text>
      </View>
    ) );
    return (
      <View style={styles.rowContainer} key={keyFn(cols.length)}>
        {cols}
      </View>
    )
  }

  render() {
    if (this.props.loading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }

    // Render row for header, then render all the rows
    return (
      <View style={styles.container}>
        {this.renderRow(this.props.headers, (i) => `header${i}`)}
        {this.props.rows.map( (row, i) => this.renderRow(row, (i) => `row${i}`) )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    flexDirection: 'row'
  },
  row: {
    flex: 1,
    alignSelf: 'stretch',
    minWidth: 64
  }
});
