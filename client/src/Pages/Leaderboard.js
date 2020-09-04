import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import Navigation from '../Components/Navigation'
import Branding from '../Images/powered_by_strava.png'
import '../Styles/Leaderboard.css'

class Leaderboard extends Component {

    componentDidMount() {
        document.body.style.background = "#ffffff"
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
                dataField: "points",
                text: "Points"
            }
        ]
        
        return (
            <div>
                <Navigation />
                <div class="leaderboard-table">
                    <BootstrapTable
                        keyField='rank'
                        data={[]}
                        columns={columns}
                    />
                </div>
                <div id="branding">
                    <img src={Branding}/>
                </div>
            </div>
        )
    }
}

export default Leaderboard;