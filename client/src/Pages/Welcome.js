import React, { Component } from 'react'
import AppLogo from '../Icons/app-logo.svg'
import StravaButton from '../Images/strava-button.png'
import Branding from '../Images/powered_by_strava.png'
import '../Styles/Welcome.css'
import '../Styles/Navigation.css'

class Welcome extends Component {

    componentDidMount() {
        document.body.style.background = "#BF5700"
    }

    render() {
        return (
            <div>
                <img class="img-center" src={AppLogo}></img>
                <h1>Run <span className="font-text-trc">TRC</span>KR</h1>
                <h5>Compete against your friends in Strava challenges</h5>
                <div class="button-center">
                    <img src={StravaButton} onClick={(e) => { window.location.assign("/login")}}></img>
                </div>
                <div id="branding">
                    <img src={Branding}/>
                </div>
            </div>
        )
    }
}

export default Welcome;
