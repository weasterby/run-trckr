import React, { Component } from 'react'
import Navigation from '../Components/Navigation'
import BootstrapTable from 'react-bootstrap-table-next'
import '../Styles/Challenges.css'

class Challenges extends Component {

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
                dataField: "start_date",
                text: "Start Date",
                sort: true,
                headerStyle: () => {
                    return { width: "10%" }
                }
            },
            {
                dataField: "end_date",
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
            <div>
                <Navigation />
                <div class="activities-table">
                    <BootstrapTable
                        keyField='id'
                        data={[]}
                        columns={columns}
                    />
                </div>
            </div>
        )
    }
}

export default Challenges;
