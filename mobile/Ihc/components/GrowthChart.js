/*
 * Display the Scatterplots for growthcharts, and the legend and axis info
 * Width and height fill up entire parent
 */
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScatterPlot from './ScatterPlot';
import Dot from './ScatterPlotComponents/Dot';

export default class GrowthChart extends Component<{}> {
  /*
   * Parent props:
   * isInfant: boolean
   * isMale: boolean
   * isWeight: boolean, false if height data
   * data: array of [{color: '<color>', unit: '%', values: [Numbers]}]
   */
  constructor(props) {
    super(props);

    // TODO: different lines for infants, axis labels
    // Mark every 2 yrs
    this.linesYears = Array.from({length: 10}, (v,i) => i * 24 ); 
    // Mark every 25 cm
    this.linesCm = Array.from({length: 10}, (v,i) => i * 25 ); 
    // Mark every 25 kg
    this.linesKg = Array.from({length: 5}, (v,i) => i * 25 ); 
    this.chartHeight = 500;

    // Info to be used in the graph legend
    const labelPairs = [['black', 'Patient'], ['red', 'P3'], ['orange', 'P5'],
      ['purple', 'P10'],
      ['green', 'P25'], ['blue', 'P50'], ['purple', 'P75'], ['orange', 'P90'],
      ['red', 'P95']].reverse();

    this.dotLabels = labelPairs.map( pair => {
      return (
        <View key={`${pair[0]}${pair[1]}`} style={styles.dotLabelContainer}>
          <Dot position="relative" bottom={-4} color={pair[0]} />
          <Text style={styles.dotLabel}>{pair[1]}</Text>
        </View>
      )
    });
  }

  render() {
    const horizontalLines = this.props.isWeight ? this.linesKg : this.linesCm;
    const title = this.props.isWeight ? 'Weight Growth Chart' : 'Height Growth Chart';
    const unitY = this.props.isWeight ? 'kg' : 'cm';
    const minAgeMonths = this.props.isInfant ? 0 : 24;
    const maxAgeMonths = this.props.isInfant ? 26 : 245;
    const maxHeight = this.props.isInfant ? 105 : 200;
    const maxWeight = this.props.isInfant ? 20 : 125;
    const maxY = this.props.isWeight ? maxWeight : maxHeight;

    return (
      <View style={styles.container}>
        <Text>{title}</Text>

        <View style={styles.legend}>
          {this.dotLabels}
        </View>

        <ScatterPlot
          height={this.chartHeight}
          width={Dimensions.get('window').width * .90}
          data={this.props.data}
          minX={minAgeMonths}
          maxX={maxAgeMonths}
          minY={0}
          maxY={maxY}
          horizontalLinesAt={horizontalLines}
          verticalLinesAt={this.linesYears}
          unitX='months'
          unitY={unitY} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  legend: {
    flex: 1,
    flexDirection: 'row',
    margin: 4,
  },
  dotLabel: {
    marginLeft: 4,
  },
  dotLabelContainer: {
    marginLeft: 4,
    width: 50,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },

});
