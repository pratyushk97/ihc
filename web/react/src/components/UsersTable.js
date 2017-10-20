import React, { Component } from 'react';
import * as firebase from '../utility/Firebase';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class UsersTable extends Component {

  constructor(props) {
    super(props);
    this.state = { users: [], loading: true };
    this.initUsers();
  }

  initUsers = () => {
    const groupId = '1';
    firebase.setupAllUsersStream(groupId, users => {
      this.setState({users: users, loading: false});
    });
  }
  render() {
    const users = this.state.users;
    const loading = this.state.loading;

    const columns = [{
      Header: 'First Name',
      accessor: 'firstname'
    }, {
      Header: 'Last Name',
      accessor: 'lastname'
    }, {
      Header: 'Birthday',
      accessor: 'birthday'
    }];

    return(
        <ReactTable data={users}
            columns={columns}
            loading={loading}
            noDataText="No updates found"
            defaultPageSize="10" />
    );
  }
}

export default UsersTable;
