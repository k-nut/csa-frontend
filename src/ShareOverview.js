import React, { Component } from 'react';
import { Table, Header, Button } from "semantic-ui-react";
import moment from "moment";
import PropTypes from "prop-types";
import Api from "./Api"


class Deposit extends Component {
    render() {
        const deposit = this.props.deposit;
        const button = (<Button> {deposit.ignore ? "Einbeziehen" : "Ignorieren"} </Button>)
        return (
        <Table.Row className={deposit.ignore && 'ignored' }>
            <Table.Cell> {moment(deposit.timestamp).format("DD.MM.YYYY")} </Table.Cell>
            <Table.Cell> {deposit.amount} </Table.Cell>
            <Table.Cell> {deposit.title} </Table.Cell>
            <Table.Cell> {deposit.person_id} </Table.Cell>
            <Table.Cell>
                {button}
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
        ignore: PropTypes.bool.isRequired,
    })
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

    render() {
        const deposits = this.state.share.deposits
            .map(deposit => {
                return <Deposit deposit={deposit} key={deposit.id}/>
            });
        return (
            <div>
                <Header> {this.state.share.name} </Header>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell> Datum </Table.HeaderCell>
                            <Table.HeaderCell> Betrag </Table.HeaderCell>
                            <Table.HeaderCell> Titel </Table.HeaderCell>
                            <Table.HeaderCell> Überweiser </Table.HeaderCell>
                            <Table.HeaderCell> Ignorieren </Table.HeaderCell>
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
