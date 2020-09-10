import React, { Component } from 'react'
import { browserHistory, withRouter } from 'react-router-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import Logo from '../Icons/app-logo.svg'
import '../Styles/Navigation.css'

class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      current_contest: {},
      contests: [],
      redirectHandler: (path)=>{return}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      current_contest: nextProps.contestProps.current_contest,
      contests: nextProps.contestProps.contests,
      redirectHandler: nextProps.contestProps.redirectHandler
    }
  }

  getcontestNavItem(contest) {
    let contestUrl = "/contest/" + contest.group_id + "/" + contest.contest_id + "/leaderboard"
    return (
        <NavDropdown.Item onClick={(e) => {window.open(contestUrl, "_self")}}>{contest.name}</NavDropdown.Item>
    )
  }

  render() {
    let contestDropdown = this.state.contests.map((contest) => this.getcontestNavItem(contest))
    return (
      <>
        <Navbar collapseOnSelect expand="lg" className="color-nav" variant="dark">
          <Navbar.Brand className="nav-brand" href="/">
            <img src={Logo} className="logo-button" style={{width: 27}} />
            Run <span className="font-text-trc">TRC</span>KR
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <NavDropdown title={this.state.current_contest.name} className="nav-item">
              {contestDropdown}
              <NavDropdown.Item onClick={(e) => {window.open("/contests", "_self")}}>+ Join a New Contest</NavDropdown.Item>
            </NavDropdown>
            <Nav className="ml-auto">
              <Nav.Link className="nav-item" onClick={() => this.state.redirectHandler("leaderboard")}>Leaderboard</Nav.Link>
              <Nav.Link className="nav-item" onClick={() => this.state.redirectHandler("activities")}>Activities</Nav.Link>
              <Nav.Link className="nav-item" onClick={() => this.state.redirectHandler("challenges")}>Challenges</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    )
  }
}

export default Navigation;