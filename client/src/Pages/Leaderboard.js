import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import '../Styles/Leaderboard.css'

class Leaderboard extends Component {

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
                <BootstrapTable
                    keyField='rank'
                    data={[]}
                    columns={columns}
                />
            </div>
        )
    }
}

export default Leaderboard;