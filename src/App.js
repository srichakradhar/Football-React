import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router , Route } from 'react-router-dom';
import Register from './components/Register'
import Login from "./components/login"
import TeamDetails from "./components/teamDetails"
import LeaderBoard from "./components/leaderboard"
import Team from './components/team'
import Editor from './components/view';

class App extends Component {
  render (){
    return (
      <div className="App">
          <Router>
          <Route exact path="/" component={Login} />
          <Route path="/Register" component={Register} />
          <Route path="/teamDetails" component={TeamDetails} />
          <Route path="/leaderboard" component={LeaderBoard} />
          <Route path="/team" component={Team} />
          <Route path="/editor" component={Editor} />
        </Router>
      </div>
    );
  }
}

export default App;
