import React, { Component } from 'react'
import axios from 'axios'
import Navigation from "./Navigation";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../Styles/Strava.css"

class ContestOverview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_contest: {},
            contests: [],
            loading: true,
            error: false,
            joining: false,
            joining_error: false,
            show_join_modal: false
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.loading && !prevState.error && (prevState.current_contest === null ||
            prevState.current_contest.group_id !== Number(nextProps.match.params.group) ||
            prevState.current_contest.contest_id !== Number(nextProps.match.params.contest))) {

            return {current_contest: {group_id: Number(nextProps.match.params.group), contest_id: Number(nextProps.match.params.contest)},
                loading: true,
                error: false}
        } else
            return null
    }

    async componentDidMount() {
        let results = await axios.get("/api/user/groups")
        if (results.data.success) {
            this.setState({
                contests: results.data.data,
                loading: false,
                error: false
            })
        } else {
            this.setState({error: true})
        }

        let current_contest = await this.getCurrentContest()
        if (current_contest !== null)
            this.setState({current_contest: current_contest,
                loading: false})
        else
            this.setState({error: true})
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.loading && !this.state.error) {
            let current_contest = await this.getCurrentContest()
            if (current_contest !== null)
                this.setState({current_contest: current_contest,
                    loading: false})
            else
                this.setState({error: true})
        }
        if (!this.state.loading && !this.state.error && !this.state.joining && !this.state.joining_error) {
            if (this.state.current_contest !== null && this.state.current_contest.role === null) {
                this.setState({show_join_modal: true})
            } else {
                this.setState({show_join_modal: false})
            }
        }

        if (this.state.joining) {
            await this.joinCurrentContest()
        }
    }

    async getCurrentContest() {
        let results = await axios
            .get("/api/groups?group=" + this.state.current_contest.group_id + "&contest=" + this.state.current_contest.contest_id)

        if (results.data.success && results.data.data.length === 1) {
            return results.data.data[0]
        } else
            return null
    }

    async joinCurrentContest() {
        try {
            let results = await axios
                .put("/api/groups/join",
                    {
                        group: this.state.current_contest.group_id,
                        contest: this.state.current_contest.contest_id
                    })
            if (results.data.success) {
                this.setState({joining: false, joining_error: false})
                window.open("/contest/" + this.state.current_contest.group_id + "/" + this.state.current_contest.contest_id + "/leaderboard", "_self")
            } else {
                this.setState({joining: false, joining_error: true})
            }
        } catch (e) {
            this.setState({joining: false, joining_error: true})
        }
    }

    render() {
        let navProps = {
            current_contest: this.state.current_contest,
            contests: this.state.contests,
            redirectHandler: (path)=>{this.props.history.push(path)}
        }

        const handleJoin = () => {this.setState({show_join_modal: false, joining: true})}
        const handleClose = () => {this.props.history.push('/contests')}

        let joinText
        console.log(this.state.current_contest)
        if (this.state.current_contest !== null && this.state.current_contest.privacy_policy !== undefined && this.state.current_contest.privacy_policy !== null) {
            console.log("test")
            console.log(this.state.current_contest.privacy_policy)
            joinText = (this.state.current_contest.privacy_policy.toLowerCase() === 'public') ?
                "To join, click the join button!" : "To join, join the club on Strava, then come back and click the join button!"
        }

        return (
            <>
                <Navigation contestProps={navProps} />

                <Modal show={this.state.show_join_modal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Join</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            <span>It looks like you haven't joined this contest hosted by </span>
                            <a href={"https://www.strava.com/clubs/" + this.state.current_contest.group_id} target="_blank" class="strava_link">{this.state.current_contest.group_name}</a>
                            <span> yet.</span>
                        </p>
                        <p>{joinText}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleJoin}>
                            Join
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.joining_error} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            It looks like there was an error joining.
                            Please make sure you are logged in and have joined the club on Strava.
                        </p>
                        <p>When you have confirmed both of these, please come back and try again.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

}

export default ContestOverview