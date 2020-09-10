import React, { Component } from 'react'
import Navigation from '../Components/Navigation'
import BootstrapTable from 'react-bootstrap-table-next'
import Branding from '../Images/powered_by_strava.png'
import axios from 'axios'
import '../Styles/Challenges.css'

class Challenges extends Component {

    state = {
        challenges: []
    }

    async componentDidMount() {
        document.body.style.background = "#ffffff"

        let challenges = await this.getChallenges()
        challenges = challenges.map(this.formatChallenge);

        this.setState({ challenges })
    }

    getChallenges = async() => {
        const group_id = this.props.match.params.group
        const contest_id = this.props.match.params.contest
        let results = await axios
            .get("/api/group/"+group_id+"/"+contest_id+"/challenges", {
                params: {
                }
            }).catch(error => {
            })

        return results.data.data
    }

    formatChallenge = (challenge) => {
        challenge.start_date_formatted = this.formatDate(challenge.start_date)
        challenge.end_date_formatted = this.formatDate(challenge.end_date)
        return challenge
    }

    formatDate = (fullDate) => {
        let date = fullDate.substring(0, fullDate.indexOf('T'))
        let dateArr = date.split('-')
        return `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`
    }

    sortDates = (a, b, order) => {
        let b_month = parseInt(b.split("-")[0])
        let b_day = parseInt(b.split("-")[1])
        let b_year = parseInt(b.split("-")[2])
        let a_month = parseInt(a.split("-")[0])
        let a_day = parseInt(a.split("-")[1])
        let a_year = parseInt(a.split("-")[2])

        if (order === 'asc') {
            return (b_year - a_year) || (b_month - a_month) || (b_day - a_day)
        } else {
            return (a_year - b_year) || (a_month - b_month) || (a_day - b_day)
        }
    }

    render() {

        const columns = [
            {
                dataField: "id",
                hidden: true
            },
            {
                dataField: "start_date_formatted",
                text: "Start Date",
                sort: true,
                headerStyle: () => {
                    return { width: "10%" }
                }
            },
            {
                dataField: "end_date_formatted",
                text: "End Date",
                sort: true,
                headerStyle: () => {
                    return { width: "10%" }
                }
            },
            {
                dataField: "name",
                text: "Name",
                headerStyle: () => {
                    return { width: "25%" }
                }
            },
            {
                dataField: "description",
                text: "Description",
                headerStyle: () => {
                    return { width: "55%" }
                }
            }
        ]

        return (
            <>
                <h1 className="challenges-header">Challenge Rules</h1>
                <h5 className="challenges-description">
                    To complete challenges, upload your workout to Strava within 48 hours of the challenge end date.
                    If your workout meets the challenge's criteria, you will receive points for completing the challenge.
                    Make sure your workout privacy settings aren't set to "Only You", or it won't be eligible for challenges.
                </h5>
                <div class="activities-table">
                    <BootstrapTable
                        keyField='id'
                        data={this.state.challenges}
                        columns={columns}
                    />
                </div>
                <div id="branding">
                    <img src={Branding}/>
                </div>
            </>
        )
    }
}

export default Challenges;
