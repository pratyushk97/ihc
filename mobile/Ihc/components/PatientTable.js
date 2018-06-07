import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  View
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {shortDate} from '../util/Date';

export default class PatientTable extends Component<{}> {
  /*
   * Expects in props:
   *  {
   *    rows: [[data]],
   *    goToPatient: function
   *    saveModal: function
   *  }
   */
  constructor(props) {
    super(props);
    this.tableHeaders = ['Name', 'Birthday', 'Checkin', 'Triage', 'Doctor',
      'Pharmacy', 'Notes'];
    this.rowNum = 0;
    // patientKey is the key of the patient we are editing the notes for in the Modal
    // currNotes is the notes to display in the modal
    // name is the name of the patient
    this.state = {showModal: false, patientKey: null, currNotes: null, name: null};
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
  openModal = (name, patientKey, currNotes) => {
    this.setState({showModal: true, patientKey: patientKey, currNotes: currNotes, name: name});
  }

  closeModal = () => {
    this.setState({showModal: false, patientKey: null, currNotes: null, name: null});
  }

  renderCol = (element, index, keyFn, name, patientKey) => {
    if (index === 6) {
      return (
        <Col style={this.getStyle(index)} size={this.getSize(index)} key={keyFn(index)}>
          <TouchableOpacity style={styles.notes}
            onPress={() => this.openModal(name, patientKey, element)}>
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
      // Pass the patient key and name
      // to the render column fn to be passed to Update Modal
      return this.renderCol(e,i,keyFn, data[0], data[7]);
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
    // TODO: Refactor Modal into separate component
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={this.closeModal} >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.title}>{this.state.name}</Text>
              <Text>Notes:</Text>
              <TextInput style={styles.notesInput}
                multiline={true}
                numberOfLines={4}
                value={this.state.currNotes}
                onChangeText={(text) => { this.setState({currNotes: text}); }} />
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.buttonContainer} onPress={this.closeModal}>
                  <Text style={styles.button}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer}
                  onPress={() => this.props.saveModal(this.state.patientKey, this.state.currNotes)}>
                  <Text style={styles.button}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Grid>
          {this.renderHeader(this.tableHeaders, (i) => `header${i}`)}
          {this.props.rows.map( row => this.renderRow(row, (i) => `row${i}`) )}
        </Grid>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  title: {
    textAlign: 'center',
    fontSize: 24
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    height: '60%',
    backgroundColor: '#f6fdff',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalFooter: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    width: 150,
    height: 40,
    margin: 10,
    padding: 8,
    elevation: 4,
    borderRadius: 2,
    backgroundColor: '#2196F3',
  },
  button: {
    fontWeight: '500',
    color: '#fefefe',
    textAlign: 'center',
  },
  notesInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '90%',
    margin: 8,
    borderWidth: 1
  }
});
