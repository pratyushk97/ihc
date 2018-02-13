import * as data from '../services/FakeDataService';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  ScrollView,
  View
} from 'react-native';
import ScatterPlot from '../components/ScatterPlot'
const boysWeightData = require('../growthchartdata/boys_weights.json');
const girlsWeightData = require('../growthchartdata/girls_weights.json');
const boysHeightData = require('../growthchartdata/boys_heights.json');
const girlsHeightData = require('../growthchartdata/girls_heights.json');

const PLOT_HEIGHT = 400
const PLOT_WIDTH = 400

export default class WeightGrowthChartScreen extends Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    const weightData = [
      {
        color: 'red',
        unit: '%',
        values: boysWeightData
      }
    ];
    const heightData = [
      {
        color: 'red',
        unit: '%',
        values: boysHeightData
      }
    ];
    // Mark every 2 yrs
    const arrYears = Array.from({length: 10}, (v,i) => i * 24 ); 
    // Mark every 50 cm
    const arrCm = Array.from({length: 5}, (v,i) => i * 50 ); 
    // Mark every 25 kg
    const arrKg = Array.from({length: 5}, (v,i) => i * 25 ); 

    return (
      // TODO: Scatterplot axes labels, label the grid lines
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Growth Chart</Text>

        <View style={styles.plotsContainer}>
          <View style={styles.plotContainer}>
            <ScatterPlot
              data={weightData}
              chartHeight={PLOT_HEIGHT}
              chartWidth={PLOT_WIDTH}
              minX={0}
              maxX={240}
              minY={0}
              maxY={125}
              horizontalLinesAt={arrKg}
              verticalLinesAt={arrYears}
              title="Weight Growth Chart"
              unitX='Age'
              unitY='Weight' />
          </View>

          <View style={styles.plotContainer}>
            <ScatterPlot
              chartHeight={PLOT_HEIGHT}
              chartWidth={PLOT_WIDTH}
              data={heightData}
              minX={0}
              maxX={240}
              minY={0}
              maxY={200}
              horizontalLinesAt={arrCm}
              verticalLinesAt={arrYears}
              title="Height Growth Chart"
              unitX='Age'
              unitY='Height' />
          </View>

        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  plotsContainer: {
    flex: 1,
    top: 50,
    margin: 8,
  },
  plotContainer: {
    flex: 1,
    minHeight: PLOT_HEIGHT + 20,
    margin: 4,
  },
  scrollContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    position: 'absolute',
    top: 4
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
