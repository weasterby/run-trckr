import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import Navigation from '../Components/Navigation'
import Branding from '../Images/powered_by_strava.png'
import '../Styles/Activities.css'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';


class Activities extends Component {
    
    constructor() {
        super();

        this.state = {
            selectedActivitiesId: 0,
            unselectedActivitiesId: 1,
            startDate: null,
            endDate: null,
            focusedInput: null,
        }
      }
    
      changeValue(selected) {
            this.setState({
                selectedActivitiesId: this.state.unselectedActivitiesId,
                unselectedActivitiesId: selected
            })
      }

    componentDidMount() {
        document.body.style.background = "#ffffff"
    }

    render() {
        
        const activities = ["All Activities", "My Activities"];

        const columns = [
            {
                dataField: "id",
                hidden: true
            },
            {
                dataField: "athlete",
                text: "Athlete",
                sort: true,
            },
            {
                dataField: "title",
                text: "Title",
                sort: true,
            },
            {
                dataField: "date",
                text: "Date",
                sort: true,
            },
            {
                dataField: "distance",
                text: "Distance (mi)",
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
                text: "Elevation Gain (ft)",
                sort: true
            },
            {
                dataField: "type",
                text: "Type",
                sort: true
            }
        ]
                  
        const rowEvents = {
          onClick: (e, row, rowIndex) => {
            console.log("clicked" + e)
            var activityId = 3942096872
             window.open("https://www.strava.com/activities/" + activityId);
          }
        };
        
        const dummyData = [{
                            title: "Such fast run",
                            id: 4,
                            date: 3,
                            pace: 1,
                        }, {
                            title: "Felt kinda slow 2day",
                            id: 2,
                            date: 4,
                            pace: 2,
                        }]

        return (
            <div>
                <Navigation />
                <DropdownButton className="activities-dropdown" title= {activities[this.state.selectedActivitiesId]}>
                    <Dropdown.Item onClick={() => this.changeValue(this.state.selectedActivitiesId)}> {activities[this.state.unselectedActivitiesId]} </Dropdown.Item>
                </DropdownButton>
                <DateRangePicker
                  startDate= {this.state.startDate}
                  startDateId="startDate"
                  endDate= {this.state.endDate}
                  endDateId="endDate"
                  onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} 
                  focusedInput={this.state.focusedInput} 
                  onFocusChange={focusedInput => this.setState({ focusedInput })} 
                />

                <div class="activities-table">
                    <BootstrapTable
                        keyField='rank'
                        data={dummyData}
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
            </div>
        )
    }
}

export default Activities;