import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import Navigation from '../Components/Navigation'
import '../Styles/Activities.css'

class Activities extends Component {

    componentDidMount() {
        document.body.style.background = "#ffffff"
    }

    render() {

        const columns = [
            {
                dataField: "id",
                hidden: true
            },
            {
                dataField: "name",
                text: "Name"
            },
            {
                dataField: "date",
                text: "Date"
            },
            {
                dataField: "distance",
                text: "Distance (Mi)",
                sort: true
            },
            {
                dataField: "moving_time",
                text: "Moving Time",
                sort: true
            },
            {
                dataField: "pace",
                text: "Pace",
                sort: true
            },
            {
                dataField: "total_elevation_gain",
                text: "Elevation Gain (Ft)",
                sort: true
            },
            {
                dataField: "type",
                text: "Type",
                sort: true
            }
        ]

        return (
            <div>
                <Navigation />
                <DropdownButton className="week-dropdown" title="Week">
                </DropdownButton>
                <div class="activities-table">
                    <BootstrapTable
                        keyField='rank'
                        data={[]}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default Activities;