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

export default class TableRow extends Component<{}> {
  constructor(props) {
    super(props);

    /*
      props = {
        data : []
        columnOrder: [keyNames]
      }
    */
  }

  render() {
    return (
      <View>
      <Text>{this.props.row}row</Text>
        <FlatList data={this.props.row}
          horizontal={true}
          renderItem={({ item }) => (
            <Text>{item}</Text>
          )}
        />
      </View>
    );
  }
}
