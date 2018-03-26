import data from '../services/DataService';
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

const PLOT_HEIGHT = 400;
const PLOT_WIDTH = 400;
const PLOTS_HEIGHT = PLOT_HEIGHT * 2 + 150;

export default class GrowthChartScreen extends Component<{}> {
  /*
   * Gets a patientInfo prop
   */
  constructor(props) {
    super(props);
  }

  extractData(data) {
    const arr = [];
    arr.push({ color: 'red', unit: '%', values: data["P3"]})
    arr.push({ color: 'orange', unit: '%', values: data["P5"]})
    arr.push({ color: 'purple', unit: '%', values: data["P10"]})
    arr.push({ color: 'green', unit: '%', values: data["P25"]})
    arr.push({ color: 'blue', unit: '%', values: data["P50"]})
    arr.push({ color: 'purple', unit: '%', values: data["P75"]})
    arr.push({ color: 'orange', unit: '%', values: data["P90"]})
    arr.push({ color: 'red', unit: '%', values: data["P95"]})
    return arr;
  }

  render() {
    // TODO: show boy or girl dependent on person
    const weightData = this.extractData(girlsWeightData);
    const heightData = this.extractData(girlsHeightData);
    // TODO: add data for this person's height/weight

    // Mark every 2 yrs
    const arrYears = Array.from({length: 10}, (v,i) => i * 24 ); 
    // Mark every 25 cm
    const arrCm = Array.from({length: 10}, (v,i) => i * 25 ); 
    // Mark every 25 kg
    const arrKg = Array.from({length: 5}, (v,i) => i * 25 ); 

    return (
      // TODO: Label the grid lines
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
    height: PLOT_HEIGHT + 20,
    margin: 4,
    padding: 8,
    backgroundColor: '#ededed'
  },
  scrollContainer: {
    minHeight: PLOTS_HEIGHT,
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
