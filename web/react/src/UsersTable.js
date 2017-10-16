import React, { Component } from 'react';
// import './UsersTable.css';
import {firebase} from './config';

class UsersTable extends Component {
  database = firebase.database();

  constructor(props) {
    super(props);
    this.state = { users: [] };
    this.initUsers();
  }

  initUsers = () => {
    const updatesRef = this.database.ref(`/groups/1/updates`);
    updatesRef.once('value')
      .then(snapshot => snapshot.val() )
      .then(updates => Object.keys(updates).map(updateKey => updates[updateKey]))
      .then(updatesLists => 
        updatesLists.reduce((acc = [], currentValue) => 
            acc = acc.concat(currentValue))
      )
      .then(users => this.setState({users: users}));
  }

  renderUsers = (users) => {
    return (
      <ol>
        {users.map(user => (
              <div className="user-row">
                <li>{user.firstname} {user.lastname}</li>
                <li>{user.birthday}</li>
              </div>
              ))}
      </ol>
    )
  }

  render() {
    const users = this.state.users;

    return(
        <div className="UsersTable">
          {users.length ? this.renderUsers(users) :
                          <span>No users found</span>}
        </div>
        );
  }
}

export default UsersTable;
