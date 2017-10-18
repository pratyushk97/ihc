import React, { Component } from 'react';
// import './UsersTable.css';
import * as firebase from './Firebase';

class UsersTable extends Component {

  constructor(props) {
    super(props);
    this.state = { users: [], updates: [] };
    this.initUsers();
    this.setupUserUpdatesStream();
  }

  initUsers = () => {
    const groupId = '1';
    firebase.setupAllUsersStream(groupId, users => {
      this.setState({users: users});
    });
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

  renderUpdates = (updates) => {
    return (
        <div>
        {updates.map(update => (
              <div className="update-row">
                <span>{update.firstname}</span>
                <span>{update.symptoms}</span>
              </div>
            ))}
        </div>
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

 setupUserUpdatesStream = () => {
    const user = {
      firstname: "Matt",
      lastname: "Chinn",
      birthday: "19960807",
    };

    firebase.setupUserUpdatesStream(user, 1, updates => {
      this.setState({updates: updates})
    });
  }

  render() {
    const users = this.state.users;
    const updates = this.state.updates;

    return(
        <div className="UsersTable">
          {users.length ? this.renderUsers(users) :
                          <span>No users found</span>}
          <button onClick={this.addUpdate}>Add Update</button>

          {this.renderUpdates(updates)}
        </div>
        );
  }
}

export default UsersTable;
