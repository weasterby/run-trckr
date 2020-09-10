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
        for (let i = 0; i < challenges.length; i++) {
            let start_time_and_date = challenges[i]["start_date"]
            let start_date = start_time_and_date.substring(0, start_time_and_date.indexOf('T'))
            let start_year = start_date.substring(0, 4)
            let start_day_month = start_date.substring(5, start_date.length)
            challenges[i]["start_date"] = start_day_month + "-" + start_year

            let end_time_and_date = challenges[i]["end_date"]
            let end_date = end_time_and_date.substring(0, end_time_and_date.indexOf('T'))
            let end_year = end_date.substring(0, 4)
            let end_day_month = end_date.substring(5, end_date.length)
            challenges[i]["end_date"] = end_day_month + "-" + end_year
        }

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
                dataField: "start_date",
                text: "Start Date",
                sort: true,
                sortFunc: (a, b, order) => {
                    return this.sortDates(a, b, order)
                },
                headerStyle: () => {
                    return { width: "10%" }
                }
            },
            {
                dataField: "end_date",
                text: "End Date",
                sort: true,
                sortFunc: (a, b, order) => {
                    return this.sortDates(a, b, order)
                },
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
                <h5 className="challenges-description">To partake in a Run Trckr challenge, join the
                Strava Group: Texas Runing Club Back to School Fall 2020 Competition and join the Texas
                Running Club group on Run Trckr. Then log your workouts on Strava in public mode to get
                credit. The current challenge or challenges, displayed below, will vary weekly with the
                start and end date specified. At the end of each challenge, three awards will be given
                out to the winning Male, winning Female, and winning new member.</h5>
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
