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
  constructor(props) {
    super(props);

    /*
    this.state = {
      loading: false,
      headers: props.headers,
      rowData: props.rowData,
      columnOrder: []
      error: null
    };
    */
  }

  /*
   * Take in data (Array of object), and for each object, convert it to an array
   * with the elements ordered as designated by the columnOrder array
   */
  createMatrix(data, columnOrder) {
    return data.map((obj) => {
      columnOrder.map( (key) => obj[key] );
    });
  }

  render() {
    if (this.props.loading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }

    /*
    const rows = this.createMatrix(this.props.rowData, this.props.columnOrder);
    console.log(rows);
    */

    return (
      <View>
        <FlatList data={this.props.headers}
          horizontal={true}
          renderItem={({item}) => (
            <Text>{item}</Text>
          )}
          keyExtractor={(item,i) => i}
        />

        <FlatList data={this.props.rows}
          renderItem={({item}) => (
            <Text>{item}</Text>
          )}
          keyExtractor={(item,i) => i}
        />

        <FlatList data={this.props.rows}
          renderItem={({ row }) => (
            <View>
            <Text>{row}</Text>
            </View>
          )}
          keyExtractor={(item,i) => i}
        />
      </View>
    );
  }
}
