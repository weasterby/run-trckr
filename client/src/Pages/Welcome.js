import React, { Component } from 'react'
import AppLogo from '../Icons/app-logo.svg'
import StravaButton from '../Images/strava-button.png'
import Branding from '../Images/powered_by_strava.png'
import '../Styles/Welcome.css'

class Welcome extends Component {

    componentDidMount() {
        document.body.style.background = "#BF5700"
    }

    render() {
        return (
            <div>
                <img class="img-center" src={AppLogo}></img>
                <h1>Run Trckr</h1>
                <h5>Compete against your friends in Strava challenges</h5>
                <div class="button-center">
                    <img src={StravaButton} onClick={(e) => { window.location.assign("/login")}}></img>
                </div>
                <h6 class="link-text">By signing in, you agree to our Privacy Policy</h6>
                <div id="branding">
                    <img src={Branding}/>
                </div>
            </div>
        )
    }
}

export default Welcome;
