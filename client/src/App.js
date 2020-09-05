import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Welcome from './Pages/Welcome'
import Leaderboard from './Pages/Leaderboard'
import Activities from './Pages/Activities'
import Challenges from './Pages/Challenges'

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Route exact path={'/'} component={Welcome} />
        <Route path={'/contest/:group/:contest/leaderboard'} component={Leaderboard} />
        <Route path={'/contest/:group/:contest/activities'} component={Activities} />
        <Route path={'/contest/:group/:contest/challenges'} component={Challenges} />
      </BrowserRouter>
    )
  }
}

export default App;
