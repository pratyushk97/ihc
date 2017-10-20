import React, { Component } from 'react';
import * as firebase from '../utility/Firebase';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class UpdatesTable extends Component {

  // Takes in a user object with firstname/lastname/birthday and groupId
  constructor(props) {
    super(props);
    this.state = { updates: [], loading: true };
    this.initUpdates(props);
  }

  initUpdates = (props) => {
    firebase.setupUserUpdatesStream(this.props.user, this.props.groupId, updates => {
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
        <div className="table">
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
