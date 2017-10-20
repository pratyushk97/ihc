import React, { Component } from 'react';
import * as firebase from '../utility/Firebase';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class UpdatesTable extends Component {

  constructor(props) {
    super(props);
    this.state = { updates: [], loading: true };
    this.initUpdates(props);
  }

  initUpdates = (props) => {
    const groupId = props.groupId;
    firebase.setupUserUpdatesStream(props.user, props.groupId, updates => {
      this.setState({updates: updates, loading: false});
    });
  }

  render() {
    const updates = this.state.updates;
    const loading = this.state.loading;

    const columns = [{
      Header: 'Date',
      accessor: 'date'
    }, {
      Header: 'Weight',
      accessor: 'Weight'
    }, {
      Header: 'Height',
      accessor: 'height'
    }, {
      Header: 'Blood Pressure',
      accessor: 'bloodpressure'
    }, {
      Header: 'Medications',
      accessor: 'medications'
    }, {
      Header: 'Symptoms',
      accessor: 'symptoms'
    }, {
      Header: 'Notes',
      accessor: 'notes'
    }];

    return(
        <div class="table">
          <h3>Updates for {props.user.firstname}</h3>
          <ReactTable data={updates}
              columns={columns}
              loading={loading}
              noDataText="No Updates found"
              defaultPageSize="10" />
        </div>
    );
  }
}

export default UpdatesTable;
