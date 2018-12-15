import React, {Component} from 'react';
import {Button, Form, Header, Table} from "semantic-ui-react";
import Api from "../Api"
import {debounce, find, sortBy} from "lodash";
import "./ShareOverview.css";
import 'react-datepicker/dist/react-datepicker.css';
import toast from "../Toast";
import MergeShare from "./MergeShare";
import Bets from "./Bets";
import SendEmail from "./SendEmail";
import Deposit from "./Deposit";
import EditDeposit from "./EditDeposit";

import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
`

class ShareOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            share: {},
            deposits: [],
        };
    }

    componentDidMount() {
        Api.getShare(this.props.match.params.id)
            .then(share => {
                this.setState({share})
            });
        Api.getShareDeposits(this.props.match.params.id)
            .then(deposits => {
                this.setState({deposits})
            });
    }

    updateNote = (_, v) => {
        const share = this.state.share;
        share.note = v.value;
        this.setState({share: share});
        this.sendUpdate(share);
    };

    changeDeposit = (deposit, property, value) => {
        const selectedDeposit = find(this.state.deposits, deposit);
        selectedDeposit[property] = value;
        this.setState({deposits: this.state.deposits});
        Api.updateDeposit(selectedDeposit)
    }

    reloadDeposits = () => {
      this.componentDidMount()
    }

    archive = () => {
        Api.updateShare({id: this.state.share.id, archived: !this.state.share.archived}).then(() => {
            this.props.history.push("/")
        })
    }

    sendUpdate = debounce(share => {
        Api.updateShare(share).then(() => {
            toast.success("Anteil aktualisiert",  '', {timeOut: 500})
        })
    }, 500);

    render() {
        const deposits = sortBy(this.state.deposits, "timestamp")
            .reverse()
            .map(deposit => {
                return <Deposit deposit={deposit} key={deposit.id} changeFunction={this.changeDeposit}/>
            });

        return (
            <Container>
                <Header> { this.state.share.name } </Header>
                <div className="spaced" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Form>
                        <Form.TextArea label="Notiz" value={this.state.share.note} onChange={this.updateNote}/>
                    </Form>
                    <Button onClick={this.archive}
                            color="red"
                            icon={this.state.share.archived ? 'repeat' : 'trash'}
                            content={this.state.share.archived ? 'Wiederherstellen' : 'Archivieren'}/>

                </div>
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
                    {this.state.deposits.length > 0 && (
                        <Table.Footer>
                            <EditDeposit personId={this.state.deposits[0].person_id}
                                         personName={this.state.deposits[0].person_name}
                                         updateFunction={this.reloadDeposits}/>
                        </Table.Footer>
                    )}
                </Table>

                { this.state.share.id && <div>
                  <Header>Gebote</Header>
                  <Bets shareId={this.state.share.id} />
                </div> }

                {this.state.share.id && <div>
                    <Header>Mit anderem Anteil zusammenführen</Header>
                    <MergeShare originalShare={this.state.share.id} history={this.props.history}/>
                </div>
                }

                <Header> E-Mails </Header>

                <SendEmail share={this.state.share} deposits={this.state.deposits}></SendEmail>

            </Container>
        );
    }
}


export default ShareOverview;
