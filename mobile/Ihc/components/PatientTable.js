import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {shortDate} from '../util/Date';

export default class PatientTable extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *    rows: [[data]],
   *    goToPatient: function
   *  }
   */
  constructor(props) {
    super(props);
    this.tableHeaders = ['Name', 'Birthday', 'Checkin', 'Triage', 'Doctor',
      'Pharmacy', 'Notes'];
    this.rowNum = 0;
  }

  getStyle(index) {
    switch(index) {
      case 1:
        return styles.birthdayCol;
      case 2:
      case 3:
      case 4:
      case 5:
        return styles.timestampCol;
      case 6:
        return styles.notesCol;
      default:
        return styles.otherCol;
    }
  }

  getText(index, element) {
    switch(index) {
      case 1: // birthday
        return shortDate(element);
      case 2: // checkin time
      case 3: // triage time
      case 4: // doctor time
      case 5: // pharmacy time
        // No time provided
        if(!element) {
          return '';
        }
        const time = new Date(element);
        // TODO: update checkintime format
        return `${time.getHours()}:${time.getMinutes()}`;
      default:
        return element;
    }
  }

  getSize(index) {
    switch(index) {
      case 1: // birthday
        return 1.5;
      case 2: // checkin time
      case 3: // triage time
      case 4: // doctor time
      case 5: // pharmacy time
        return 1;
      case 6: // notes
        return 3;
      default:
        return 2;
    }
  }

  // Modal to update the Notes field of Status object
  openModal = () => {
    // TODO:
  }

  renderCol = (element, index, keyFn) => {
    if (index === 6) {
      return (
        <Col style={this.getStyle(index)} size={this.getSize(index)} key={keyFn(index)}>
          <TouchableOpacity style={styles.notes} onPress={this.openModal}>
            <Text>{element}</Text>
          </TouchableOpacity>
        </Col>
      );
    }

    return (
      <Col style={this.getStyle(index)} size={this.getSize(index)} key={keyFn(index)}>
        <Text>{this.getText(index, element)}</Text>
      </Col>
    );
  }

  renderRow = (data, keyFn) => {
    // e is the current element
    let cols = data.map( (e,i) => {
      if(i === 7)
        return null; // Patient key col shouldn't render
      return this.renderCol(e,i,keyFn);
    });
    cols.splice(7,1); // remove patient key column

    return (
      <Row key={`row${this.rowNum++}`} style={styles.rowContainer}
        onPress={() => this.props.goToPatient(data)}>
        {cols}
      </Row>
    );
  }

  renderHeader(data, keyFn) {
    const cols = data.map( (e,i) => (
      <Col size={this.getSize(i)} style={this.getStyle(i)} key={keyFn(i)}>
        <Text style={styles.text}>{e}</Text>
      </Col>
    ) );

    return (
      <Row style={styles.headerRow}>
        {cols}
      </Row>
    );
  }

  render() {
    // Render row for header, then render all the rows
    return (
      <Grid>
        {this.renderHeader(this.tableHeaders, (i) => `header${i}`)}
        {this.props.rows.map( row => this.renderRow(row, (i) => `row${i}`) )}
      </Grid>
    );
  }
}

export const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    alignSelf: 'stretch',
    minHeight: 32
  },
  timestampCol: {
    maxWidth: 60,
    borderWidth: 1
  },
  notesCol: {
    borderWidth: 1,
  },
  birthdayCol: {
    borderWidth: 1,
  },
  otherCol: {
    borderWidth: 1
  },
  headerRow: {
    backgroundColor: '#dbdbdb',
    borderWidth: 1,
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
  },
  notes: {
    height: '100%',
    width: '100%',
    backgroundColor: '#bebebe',
  }
});
