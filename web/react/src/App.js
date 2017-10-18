import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import {firebase} from './config';
import UsersTable from './UsersTable';

class App extends Component {
  database = firebase.database();
  increment = () => { this.setState({result: this.state.result+1})};
  state = { result: 0 };
  load = () => {
    /* Only mobile part calls Express API 
    fetch(config.api_home + '/groups/1/all/1')
      .then(res => res.json(), error => console.log(error))
      .then(res => this.setState({result: "done"}), error => console.log(error));
    */
  }

  render() {
    var result = this.state.result;
    // this.load();

    return(
        <div className="App">
          <h1>Users</h1>
          <UsersTable />
          <p className="App-intro">{result}
          </p>
          <button onClick={this.increment}/>
        </div>
        );
    /*
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
    */
  }
}

export default App;
