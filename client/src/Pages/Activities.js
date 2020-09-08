import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import Navigation from '../Components/Navigation'
import Branding from '../Images/powered_by_strava.png'
import '../Styles/Activities.css'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import axios from 'axios'
import moment from 'moment';


class Activities extends Component {
    
    constructor() {
        super();

        this.state = {
            selectedActivitiesId: 0,
            unselectedActivitiesId: 1,
            startDate: null,
            endDate: null,
            focusedInput: null,
            allActivities: []
        }
      }
    
    async componentDidMount() {
        document.body.style.background = "#ffffff"
        await this.getActivities()
    }
    
    async componentDidUpdate(prevProps, prevState){
        if(prevState.startDate != this.state.startDate || 
           prevState.endDate != this.state.endDate || 
           prevState.selectedActivitiesId != this.state.selectedActivitiesId){
            await this.getActivities()
        }
        
    }
    
    getActivities = async() => {
        
        let set = this.state.selectedActivitiesId == 0 ? "all" : "me"
        const group_id = this.props.match.params.group
        const contest_id = this.props.match.params.contest
        let results = await axios
            .get("/api/group/"+group_id+"/"+contest_id+"/activities/" + set, {
                params: {
                }
            }).catch(error => {
            })    
        
        //filters and formats the data
        var activities = results.data.data
        activities = this.filterActivities(activities)
        let allActivities = activities.map(this.formatActivity)
        
        console.log(allActivities)
        this.setState({allActivities})
    }
    
    filterActivities = (activities) => {
        activities = this.filterDates(activities)
        return activities
    }
    
    formatActivity = (activity) => {
        activity.distance_standard = (activity.distance / 1609.344).toFixed(2)
        activity.formatted_time = this.formatTime(activity.moving_time)
        activity.pace = this.formatPace(activity.moving_time, activity.distance_standard)
        activity.start_date_local = this.formatDate(activity.start_date_local)
        activity.total_elevation_gain = (activity.total_elevation_gain * 3.28084).toFixed(2)
        return activity
    }
    
    formatPace(time, distance) {    
      let decimal_pace = (time / 60) / (distance)
      let remainder = decimal_pace % 1
      let minutes = Math.floor(decimal_pace)
      let seconds = Math.floor(remainder * 60)
      if (seconds < 10) {
        seconds = "0" + seconds.toFixed(0)
      } else {
        seconds = seconds.toFixed(0)
      }
      let result = minutes + ":" + seconds + " /mi"
      return result
    }

    formatTime = (secs) => {
        var hours = Math.floor(secs / 3600)
        var minutes = Math.floor((secs - (hours * 3600)) / 60)
        var seconds = secs - (hours * 3600) - (minutes * 60)
        var time = ""

        if (hours !== 0) {
            time = hours + ":"
        }

        if (minutes !== 0 || time !== "") {
            minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes)
            time += minutes + ":"
        }

        if (time === "") {
            time = seconds + "s"
        } else {
            time += (seconds < 10) ? "0" + seconds : String(seconds)
        }

        return time
    }
    
    formatDate = (fullDate) => {
        let date = fullDate.substring(0, fullDate.indexOf('T'))
        let dateArr = date.split('-')
        return `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`
    }
    
    sortDates = (a, b, order) => {
        //compares strings in the format YYYY-MM-DD
        let comparison = a.substring(0, a.indexOf('T')).localeCompare(b.substring(0, b.indexOf('T')))
        if (order === 'asc') {
            return comparison
        } else {
            return !comparison
        }
    }

    sortPace = (a, b, order) => {
        let b_minutes = parseInt(b.split(":")[0])
        let b_seconds = parseInt(b.split(":")[1].substring(0,2))
        let a_minutes = parseInt(a.split(":")[0])
        let a_seconds = parseInt(a.split(":")[1].substring(0,2))

        return order === 'asc' ? (b_minutes - a_minutes || b_seconds - a_seconds) : (a_minutes - b_minutes || a_seconds - b_seconds)
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
     
    filterDates = (activities) => {
        var filteredActivities = []
        
        activities.forEach(activity =>{
            let validStart = true
            let validEnd = true
            let dateIndex = activity.start_date_local.indexOf('T')
            let activityDate = activity.start_date_local.substring(0, dateIndex)
            
            if(this.state.startDate != null){
                let formattedStartDate = this.state.startDate.format('YYYY-MM-DD')
                validStart = activityDate.localeCompare(formattedStartDate) > -1
            }
            
            if(this.state.endDate != null){
                let formattedEndDate = this.state.endDate.format('YYYY-MM-DD')
                validEnd = activityDate.localeCompare(formattedEndDate) < 1
            }
            
            if (validStart && validEnd){
                filteredActivities.push(activity)
            }
        
        })
        return filteredActivities
    }
    
    changeValue(selected) {
        this.setState({
            selectedActivitiesId: this.state.unselectedActivitiesId,
            unselectedActivitiesId: selected
        })
    }

     isOutsideRange (day) {
        const isBeforeStart = day.isBefore(moment('2020-08-20'))
        const isAfterToday = day.isAfter(moment().add(1, 'days'))
        return isBeforeStart || isAfterToday
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
                sort: true
            },
            {
                dataField: "name",
                text: "Title"
            },
            {
                dataField: "start_date_local",
                text: "Date",
                sort: true
            },
            {
                dataField: "distance_standard",
                text: "Distance (mi)",
                sort: true,
                sortFunc: (a, b, order) => {
                    return order === 'asc' ? b - a : a - b
                }
            },
            {
                dataField: "formatted_time",
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
                text: "Elevation Gain (ft)",
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
                  
        const rowEvents = {
          onClick: (e, row, rowIndex) => {
            console.log("clicked" + e)
             window.open("https://www.strava.com/activities/" + row.id);
          }
        };
        
        return (
            <>
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
                    isOutsideRange={this.isOutsideRange}
                  onFocusChange={focusedInput => this.setState({ focusedInput })} 
                />
                <div class="activities-table">
                    <BootstrapTable
                        keyField='rank'
                        data={this.state.allActivities}
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

export default Activities;