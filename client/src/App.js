import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Welcome from './Pages/Welcome'

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Route exact path={'/'} component={Welcome} />
      </BrowserRouter>
    )
  }
}

export default App;
