import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import Navigation from '../Components/Navigation'
import '../Styles/Activities.css'

class Activities extends Component {

    componentDidMount() {
        document.body.style.background = "#ffffff"
    }

    sortDuration = (a, b, order) => {
        var b_hours = 0
        var b_minutes = 0
        var b_seconds = 0
        var a_hours = 0
        var a_minutes = 0
        var a_seconds = 0

        if (b.split(":").length === 3) {
            b_hours = parseInt(b.split(":")[0])
            b_minutes = parseInt(b.split(":")[1])
            b_seconds = parseInt(b.split(":")[2])
        } else {
            b_minutes = parseInt(b.split(":")[0])
            b_seconds = parseInt(b.split(":")[1])
        }
        if (a.split(":").length === 3) {
            a_hours = parseInt(a.split(":")[0])
            a_minutes = parseInt(a.split(":")[1])
            a_seconds = parseInt(a.split(":")[2])
        } else {
            a_minutes = parseInt(a.split(":")[0])
            a_seconds = parseInt(a.split(":")[1])
        }

        if (order === 'asc') {
            return (b_hours - a_hours) || (b_minutes - a_minutes) || (b_seconds - a_seconds)
        } else {
            return (a_hours - b_hours) || (a_minutes - b_minutes) || (a_seconds - b_seconds)
        }

    }

    sortPace = (a, b, order) => {
        let b_minutes = parseInt(b.split(":")[0])
        let b_seconds = parseInt(b.split(":")[1].substring(0,2))
        let a_minutes = parseInt(a.split(":")[0])
        let a_seconds = parseInt(a.split(":")[1].substring(0,2))

        return order === 'asc' ? (b_minutes - a_minutes || b_seconds - a_seconds) : (a_minutes - b_minutes || a_seconds - b_seconds)
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
                sort: true,
                sortFunc: (a, b, order) => {
                    return order === 'asc' ? b - a : a - b
                }
            },
            {
                dataField: "moving_time",
                text: "Moving Time",
                sort: true,
                sortFunc: (a, b, order) => {
                    return this.sortDuration(a, b, order)
                }
            },
            {
                dataField: "pace",
                text: "Pace",
                sort: true,
                sortFunc: (a, b, order) => {
                    return this.sortPace(a, b, order)
                }
            },
            {
                dataField: "total_elevation_gain",
                text: "Elevation Gain (Ft)",
                sort: true,
                sortFunc: (a, b, order) => {
                    return order === 'asc' ? b - a : a - b
                }
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