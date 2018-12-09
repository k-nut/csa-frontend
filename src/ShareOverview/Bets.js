import React, {Component} from "react";
import PropTypes from "prop-types";
import Api from "../Api";
import toast from "../Toast";
import Bet from "./Bet";

import styled from 'styled-components';

const BetContainer = styled.div`
    & > div {
        margin-top: 10px
    }
`

class Bets extends Component {
    static propTypes = {
        shareId: PropTypes.number,
    };

    constructor(props) {
        super(props)
        this.state = {
            bets: []
        }
        this.loadData = this.loadData.bind(this);
        this.deleteBet = this.deleteBet.bind(this);
        this.updateBet = this.updateBet.bind(this);
    }

    loadData() {
        Api.getBets(this.props.shareId).then(json => this.setState({bets: json.bets}))
    }

    componentDidMount() {
        this.loadData()
    }

    deleteBet(betId) {
        Api.deleteBet(this.props.shareId, betId).then(this.loadData)
    }

    updateBet(bet) {
        Api.updateBet(this.props.shareId, bet).then(() => {
            this.loadData();
            toast.success("Gebot aktualisiert", '', {timeOut: 500})
        })
    }

    render() {
        const betsWithNew = this.state.bets.concat({});
        const bets = betsWithNew.map(bet => <Bet key={bet.id}
                                                 bet={bet}
                                                 deleteCallback={this.deleteBet}
                                                 updateCallback={this.updateBet}
        />);
        return <BetContainer>{bets}</BetContainer>
    }
}

export default Bets;