import React, { Component } from 'react';
import { Table, Header, Input, Checkbox, Button } from "semantic-ui-react";
import moment from "moment";
import PropTypes from "prop-types";
import Api from "./Api"
import {debounce, find, sortBy} from "lodash";
import "./ShareOverview.css";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';



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
        <Table.Row className={(deposit.ignore || deposit.is_security) ? 'ignored': "" }>
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


class EditDeposit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timestamp: moment(),
            person_id: props.personId,
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChange = (date) => {
        this.setState({timestamp: date})
    };

    submit = () => {
        const deposit = this.state;
        deposit.timestamp = moment(deposit.timestamp).format("YYYY-MM-DD");
        Api.addDeposit(deposit)
        console.log('done')
        this.state = {timestamp: moment()}
        this.props.updateFunction()
    };

    handleInputChange(_, target) {
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }


    render() {
        const disableButton = (!this.state.amount || !this.state.title);
        return (
            <Table.Row>
                <Table.Cell>
                    <DatePicker
                        dateFormat="DD.MM.YYYY"
                        selected={this.state.timestamp}
                        onChange={this.handleChange} />
                </Table.Cell>
                <Table.Cell>
                    <Input value={this.state.amount} onChange={this.handleInputChange} type="number" name="amount"/>
                </Table.Cell>
                <Table.Cell>
                    <Input value={this.state.title} onChange={this.handleInputChange} name="title"/>
                </Table.Cell>
                <Table.Cell> {this.props.personId} </Table.Cell>
                <Table.Cell>
                    <Checkbox checked={this.state.ignore} onChange={this.handleInputChange} name="ignore"> </Checkbox>
                </Table.Cell>
                <Table.Cell>
                    <Checkbox checked={this.state.is_security} onChange={this.handleInputChange} name="is_security"> </Checkbox>
                    <Button onClick={this.submit} disabled={disableButton}>Hinzufügen</Button>
                </Table.Cell>
            </Table.Row>
        )
    }
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
        const selectedDeposit  = find(this.state.share.deposits, deposit);
        selectedDeposit[property] = value;
        this.setState({share: this.state.share});
        Api.updateDeposit(selectedDeposit)
    }

    reloadDeposits = () => {
        Api.getShare(this.props.match.params.id)
            .then(share => {this.setState({ share })
            });
    }

    sendUpdate = debounce(share => {Api.updateShare(share)}, 500);

    render() {
        const deposits = sortBy(this.state.share.deposits, "timestamp")
            .reverse()
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
                    {this.state.share.deposits.length && (
                        <Table.Footer>
                           <EditDeposit personId={this.state.share.deposits[0].person_id}
                                        updateFunction={this.reloadDeposits}/>
                        </Table.Footer>
                    )}
                </Table>
            </div>
        );
    }
}



export default ShareOverview;
