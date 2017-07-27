import React, { Component } from 'react';
import { Table, Header, Input, Checkbox } from "semantic-ui-react";
import moment from "moment";
import PropTypes from "prop-types";
import Api from "./Api"
import {debounce, find} from "lodash";
import "./ShareOverview.css";


class Deposit extends Component {

    changeSecurity = (_, data) => {
        this.props.changeFunction(this.props.deposit, 'is_security', data.checked)
    };

    changeIgnore = (_, data) => {
        this.props.changeFunction(this.props.deposit, 'ignore', data.checked)
    };

    render() {
        const deposit = this.props.deposit;
        const ignore = (<Checkbox checked={deposit.ignore} onChange={this.changeIgnore}> </Checkbox>)
        const security = (<Checkbox checked={deposit.is_security} onChange={this.changeSecurity}> </Checkbox>)
        return (
        <Table.Row className={(deposit.ignore || deposit.is_security) && 'ignored' }>
            <Table.Cell> {moment(deposit.timestamp).format("DD.MM.YYYY")} </Table.Cell>
            <Table.Cell> {deposit.amount} </Table.Cell>
            <Table.Cell> {deposit.title} </Table.Cell>
            <Table.Cell> {deposit.person_id} </Table.Cell>
            <Table.Cell>
                {ignore}
            </Table.Cell>
            <Table.Cell>
                {security}
            </Table.Cell>
        </Table.Row>
        )
    }
}

Deposit.propTypes = {
    deposit: PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        person_id: PropTypes.number.isRequired,
        ignore: PropTypes.bool,
        is_security: PropTypes.bool,
    }),
    changeFunction: PropTypes.func
}

class ShareOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            share: { deposits : []},
        };
    }

    componentDidMount() {
        Api.getShare(this.props.match.params.id)
            .then(share => {this.setState({ share })
        });
    }

    updateEmail = (_, v) => {
        const share  = this.state.share;
        share.email = v.value;
        this.setState({share: share});
        this.sendUpdate(share);
    };

    changeDeposit  = (deposit, property, value) => {
        console.log(property, value)
        const selectedDeposit  = find(this.state.share.deposits, deposit);
        selectedDeposit[property] = value;
        this.setState({share: this.state.share});
        Api.updateDeposit(selectedDeposit)
    }

    sendUpdate = debounce(share => {Api.updateShare(share)}, 500);

    render() {
        const deposits = this.state.share.deposits
            .map(deposit => {
                return <Deposit deposit={deposit} key={deposit.id} changeFunction={this.changeDeposit}/>
            });
        return (
            <div>
                <Header> {this.state.share.name} </Header>
                <Input label="E=Mail" value={this.state.share.email} onChange={this.updateEmail} />
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell> Datum </Table.HeaderCell>
                            <Table.HeaderCell> Betrag </Table.HeaderCell>
                            <Table.HeaderCell> Titel </Table.HeaderCell>
                            <Table.HeaderCell> Überweiser </Table.HeaderCell>
                            <Table.HeaderCell> Ignorieren </Table.HeaderCell>
                            <Table.HeaderCell> Kaution </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {deposits}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}



export default ShareOverview;
