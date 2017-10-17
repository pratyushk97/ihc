import React, { Component } from 'react';
// import './UsersTable.css';
import * as firebase from './Firebase';

class UsersTable extends Component {

  constructor(props) {
    super(props);
    this.state = { users: [] };
    this.initUsers();
  }

  initUsers = () => {
    const groupId = '1';
    firebase.getAllUsers(groupId).then(users => this.setState(users: users));
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

  addUpdate = () => {
    const update = {
      firstname: "Matt",
      lastname: "Chinn",
      birthday: "19960807",
      symptoms: "sexy"
    };
    const update2 = {
      firstname: "Brandon",
      lastname: "Chinn",
      birthday: "19950516",
      symptoms: "sexy"
    };
    firebase.addUpdates([update, update2], 1);
  }

  render() {
    const users = this.state.users;

    return(
        <div className="UsersTable">
          {users.length ? this.renderUsers(users) :
                          <span>No users found</span>}
          <button onClick={this.addUpdate}>Add Update</button>
        </div>
        );
  }
}

export default UsersTable;
