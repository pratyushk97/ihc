import * as data from '../services/FakeDataService';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  View
} from 'react-native';
import ScatterPlot from '../components/ScatterPlot'
const boysWeightData = require('../growthchartdata/boys_weights.json');
const girlsWeightData = require('../growthchartdata/girls_weights.json');

export default class WeightGrowthChartScreen extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {boys: boysWeightData};
  }

  render() {
    const chartData = [
      {
        color: 'red',
        unit: '%',
        values: this.state.boys
      }
    ];
    return (
      <View style={styles.container}>
        <Text>Growth Chart</Text>
        <ScatterPlot
          backgroundColor='#ffffff'
          data={chartData}
          chartHeight={200}
          chartWidth={200}
          minX={25}
          maxX={250}
          minY={15}
          maxY={100}
          unitX='Age'
          unitY='Weight' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
