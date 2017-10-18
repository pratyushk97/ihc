import React, { Component } from 'react';
import * as firebase from './Firebase';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class UsersTable extends Component {

  constructor(props) {
    super(props);
    this.state = { users: [], updates: [] };
    this.initUsers();
  }

  initUsers = () => {
    const groupId = '1';
    firebase.setupAllUsersStream(groupId, users => {
      this.setState({users: users});
    });
  }
  render() {
    const users = this.state.users;
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
            noDataText="No users found"
            defaultPageSize="10" />
    );
  }
}

export default UsersTable;
