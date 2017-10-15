import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import * as config from './config';

let done = false;
class App extends Component {
  state = { result: "" };
  load = () => {
    if(!done){
    fetch(config.api_home + '/groups/1/all/1')
      .then(res => res.json(), error => console.log(error))
      .then(res => this.setState({result: "done"}), error => console.log(error));
    }
  }

  render() {
    var result = this.state.result;
    this.load();
    done = true;

    return(
        <div className="App">
          <p className="App-intro">{result}
          </p>
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
