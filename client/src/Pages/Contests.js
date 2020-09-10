import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Branding from '../Images/powered_by_strava.png'
import '../Styles/Contests.css'
import "../Styles/Strava.css"
import axios from 'axios'
import moment from 'moment';
import {Navbar} from "react-bootstrap";
import Logo from "../Icons/app-logo.svg";
import '../Styles/Navigation.css'


class Contests extends Component {

    constructor() {
        super();

        this.state = {
            publicGroups: [],
            myGroups: []
        }
    }

    async componentDidMount() {
        document.body.style.background = "#ffffff"
        await this.getGroups()
    }

    async componentDidUpdate(prevProps, prevState){
        if(false){
            await this.getGroups()
        }

    }

    getGroups = async() => {

        let publicResults = await axios
            .get("/api/groups", {
                params: {}
            }).catch(error => {
            })

        //filters and formats the data
        var publicGroups = publicResults.data.data.map(this.formatContest)

        let myResults = await axios
            .get("/api/user/groups", {
                params: {}
            }).catch(error => {
            })

        //filters and formats the data
        var myGroups = myResults.data.data.map(this.formatContest)

        this.setState({publicGroups, myGroups})
    }

    formatContest = (contest) => {
        console.log(contest)
        contest.start_date_formatted = this.formatDate(contest.start_date)
        contest.end_date_formatted = this.formatDate(contest.end_date)
        return contest
    }

    formatDate = (fullDate) => {
        let date = fullDate.substring(0, fullDate.indexOf('T'))
        let dateArr = date.split('-')
        return `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`
    }

    render() {

        const columns = [
            {
                dataField: "group_id",
                hidden: true
            },
            {
                dataField: "contest_id",
                hidden: true
            },
            {
                dataField: "name",
                text: "Contest Name"
            },
            {
                dataField: "group_name",
                text: "Strava Club",
                classes: "strava_link",
                events: {
                    onClick: (e, column, columnIndex, row, rowIndex) => {  window.open("https://www.strava.com/clubs/" + row.group_id) }
                }
            },
            {
                dataField: "start_date_formatted",
                text: "Start Date"
            },
            {
                dataField: "end_date_formatted",
                text: "End Date"
            }
        ]

        const rowEvents = {
            onClick: (e, row, rowIndex) => {
                console.log("clicked" + e)
                window.open("/contest/" + row.group_id + "/" + row.contest_id + "/leaderboard", "_self");
            }
        };

        return (
            <>
                <Navbar collapseOnSelect expand="lg" className="color-nav" variant="dark">
                    <Navbar.Brand className="nav-brand" href="/">
                        <img src={Logo} className="logo-button" style={{width: 27}} />
                        Run <span className="font-text-trc">TRC</span>KR
                    </Navbar.Brand>
                </Navbar>
                <div className="contests-table">
                    <h4>My Contests</h4>
                    <BootstrapTable
                        keyField='contest_id'
                        data={this.state.myGroups}
                        columns={columns}
                        hover
                        headerClasses="header-class"
                        rowClasses="row-class"
                        rowEvents={rowEvents}
                    />
                </div>
                <div class="contests-table">
                    <h4>Public Contests</h4>
                    <span>To join a new contest, click on one of the contests below:</span>
                    <BootstrapTable
                        keyField='contest_id'
                        data={this.state.publicGroups}
                        columns={columns}
                        hover
                        headerClasses="header-class"
                        rowClasses= "row-class"
                        rowEvents={ rowEvents }
                    />
                </div>
                <div id="branding">
                    <img src={Branding}/>
                </div>
            </>
        )
    }
}

export default Contests;