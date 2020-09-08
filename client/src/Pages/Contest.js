import React, { Component } from 'react'
import axios from 'axios'
import Navigation from "../Components/Navigation";

class Contest extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_contest: {},
            contests: [],
            loading: true,
            error: false
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
    }

    async getCurrentContest() {
        let results = await axios
            .get("/api/groups?group=" + this.state.current_contest.group_id + "&contest=" + this.state.current_contest.contest_id)

        if (results.data.success && results.data.data.length === 1) {
            return results.data.data[0]
        } else
            return null
    }

    render() {
        let navProps = {
            current_contest: this.state.current_contest,
            contests: this.state.contests,
            redirectHandler: (path)=>{this.props.history.push(path)}
        }

        return (
            <Navigation contestProps={navProps} />
        )
    }

}

export default Contest