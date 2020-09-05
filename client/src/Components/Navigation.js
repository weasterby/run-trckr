import React, { Component } from 'react'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import Logo from '../Icons/app-logo.svg'
import '../Styles/Navigation.css'

class Navigation extends Component {

  state = {
    contest: 'Select Contest'
  }

    render() {
        return (
            <>
              <Navbar collapseOnSelect expand="lg" className="color-nav" variant="dark">
                <Navbar.Brand className="nav-brand" href="/">
                  <img src={Logo} className="logo-button" style={{width: 27}} /> 
                  Run Trckr
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <NavDropdown title={this.state.contest} className="nav-item">
                    <NavDropdown.Item onClick={(e) => {this.setState({ contest: 'Texas Running Club Fall 2020 Contest'})}}>Texas Running Club Fall 2020 Contest</NavDropdown.Item>
                    <NavDropdown.Item onClick={(e) => {this.setState({ contest: 'Texas Triathlon Club Fall 2020 Contest'})}}>Texas Triathlon Club Fall 2020 Contest</NavDropdown.Item>
                  </NavDropdown>
                  <Nav className="ml-auto">
                    <Nav.Link className="nav-item" href="/leaderboard">Leaderboard</Nav.Link>
                    <Nav.Link className="nav-item" href="/activities">Activities</Nav.Link>
                    <Nav.Link className="nav-item" href="/challenges">Challenges</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </>
        )
    }
}

export default Navigation;