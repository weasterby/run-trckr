import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Navigation from '../Components/Navigation'
import Branding from '../Images/powered_by_strava.png'
import axios from 'axios'
import '../Styles/Leaderboard.css'

class Leaderboard extends Component {

    state = {
        leaderboard: []
    }

    async componentDidMount() {
        document.body.style.background = "#ffffff"

        let leaderboard = await this.getLeaders()
        
        
        this.setState({ leaderboard })
    }

    getLeaders = async() => {
        const group_id = this.props.match.params.group
        const contest_id = this.props.match.params.contest
        let results = await axios
            .get("/api/group/"+group_id+"/"+contest_id+"/leaderboard", {
                params: {
                }
            }).catch(error => {
            })
            
        return results.data.data
    }
    
    render() {
        
        const columns = [
            {
                dataField: "rank",
                text: "Rank"
            },
            {
                dataField: "name",
                text: "Name"
            },
            {
                dataField: "total_points",
                text: "Points"
            }
        ]
        
        return (
            <>
                <div class="leaderboard-table">
                    <BootstrapTable
                        keyField='rank'
                        data={this.state.leaderboard}
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

export default Leaderboard;