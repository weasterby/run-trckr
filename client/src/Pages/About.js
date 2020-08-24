import React, { Component } from 'react'
import Navigation from '../Components/Navigation'
import '../Styles/About.css'

class About extends Component {

    componentDidMount() {
        document.body.style.background = "#ffffff"
    }

    render() {
        return (
            <div>
                <Navigation />
            </div>
        )
    }
}

export default About;
