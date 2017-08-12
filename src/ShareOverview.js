import React, {Component} from 'react';
import {Table, Header, Input, Checkbox, Button, Dropdown, Form} from "semantic-ui-react";
import moment from "moment";
import PropTypes from "prop-types";
import Api from "./Api"
import {debounce, find, sortBy} from "lodash";
import "./ShareOverview.css";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import * as Email from "./Email";
import toastr from "toastr";


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
            <Table.Row className={(deposit.ignore || deposit.is_security) ? 'ignored' : ""}>
                <Table.Cell> {moment(deposit.timestamp).format("DD.MM.YYYY")} </Table.Cell>
                <Table.Cell> {deposit.amount} </Table.Cell>
                <Table.Cell> {deposit.title} </Table.Cell>
                <Table.Cell> {deposit.person_name} </Table.Cell>
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
        person_name: PropTypes.string,
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
                        onChange={this.handleChange}/>
                </Table.Cell>
                <Table.Cell>
                    <Input value={this.state.amount} onChange={this.handleInputChange} type="number" name="amount"/>
                </Table.Cell>
                <Table.Cell>
                    <Input value={this.state.title} onChange={this.handleInputChange} name="title"/>
                </Table.Cell>
                <Table.Cell> {this.props.personName} </Table.Cell>
                <Table.Cell>
                    <Checkbox checked={this.state.ignore} onChange={this.handleInputChange} name="ignore"> </Checkbox>
                </Table.Cell>
                <Table.Cell>
                    <Checkbox checked={this.state.is_security} onChange={this.handleInputChange}
                              name="is_security"> </Checkbox>
                    <Button onClick={this.submit} disabled={disableButton}>Hinzufügen</Button>
                </Table.Cell>
            </Table.Row>
        )
    }
}

class MergeShare extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sharesList: [],
            selectedShare: null
        }

        this.changShare = this.changShare.bind(this);
        this.mergeItems = this.mergeItems.bind(this);
    }

    componentDidMount() {
        Api.getShares().then(shares => {
            const sharesList = shares
                .filter(share => share.id !== this.props.originalShare)
                .map(share => {
                    return {
                        value: share.id,
                        text: share.name,
                    }
                });
            this.setState({sharesList})
        });
    }

    changShare(_, data) {
        this.setState({selectedShare: data.value})
    }

    mergeItems() {
        Api.mergeShares(this.props.originalShare, this.state.selectedShare).then(() => {
            this.props.history.push("/")
        });
    }

    render() {
        return (
            <div>
                <Dropdown selection
                          value={this.state.selectedShare}
                          onChange={this.changShare}
                          options={this.state.sharesList}/>
                <Button onClick={this.mergeItems}
                        disabled={!this.state.selectedShare}
                        content="Zusammenführen"/>
            </div>
        )
    }

}

MergeShare.propTypes = {
    originalShare: PropTypes.number,
    history: PropTypes.object,
}

class ShareOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            share: {},
            deposits: []
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

    updateEmail = (_, v) => {
        const share = this.state.share;
        share.email = v.value;
        this.setState({share: share});
        this.sendUpdate(share);
    };

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
        Api.getShare(this.props.match.params.id)
            .then(share => {
                this.setState({share})
            });
    }

    archive = () => {
        Api.updateShare({id: this.state.share.id, archived: !this.state.share.archived}).then(() => {
            this.props.history.push("/")
        })
    }

    sendDifference = () => {
        window.location.href = Email.getDifferenceText(this.state.share, this.state.deposits);
    };

    sendMissing = () => {
        window.location.href =  Email.getMissingText(this.state.share);
    };


    sendUpdate = debounce(share => {
        Api.updateShare(share).then(() => {
            toastr.success("Anteil aktualisiert",  '', {timeOut: 500})
        })
    }, 500);

    render() {
        const deposits = sortBy(this.state.deposits, "timestamp")
            .reverse()
            .map(deposit => {
                return <Deposit deposit={deposit} key={deposit.id} changeFunction={this.changeDeposit}/>
            });
        return (
            <div>
                <Header> {this.state.share.name} </Header>
                <div className="spaced" style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                    <Input label="E-Mail" value={this.state.share.email || ""} onChange={this.updateEmail}/>
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
                    {this.state.deposits.length && (
                        <Table.Footer>
                            <EditDeposit personId={this.state.deposits[0].person_id}
                                         personName={this.state.deposits[0].person_name}
                                         updateFunction={this.reloadDeposits}/>
                        </Table.Footer>
                    )}
                </Table>

                {this.state.share.id && <div>
                    <Header>Mit anderem Anteil zusammenführen</Header>
                    <MergeShare originalShare={this.state.share.id} history={this.props.history}/>
                </div>
                }

                <Header> E-Mails </Header>

                { !this.state.share.email ?
                    <div> Wenn du oben eine E-Mail Adresse hinzufügst kannst du hier vorformulierte E-Mails senden</div>
                    : <div>
                        <Button content="Unstimmigkeit"
                        onClick={this.sendDifference}
                        icon="mail"/>

                        <Button content="Fehlender Beitrag"
                        onClick={this.sendMissing}
                        icon="mail"/>
                    </div>
                }


            </div>
        );
    }
}


export default ShareOverview;
