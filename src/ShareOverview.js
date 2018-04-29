import React, {Component} from 'react';
import {Table, Header, Input, Checkbox, Button, Dropdown, Form} from "semantic-ui-react";
import moment from "moment";
import PropTypes from "prop-types";
import Api from "./Api"
import {debounce, find, sortBy, range} from "lodash";
import "./ShareOverview.css";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

import * as Email from "./Email";
import toast from "./Toast";


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
        Api.addDeposit(deposit);
        this.setState({
          timestamp: moment(),
          amount: 0,
          title: '',
          ignore: null,
          is_security: null,
        });
        this.props.updateFunction()
    }

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
                          search
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

class Bet extends Component {
  constructor(props){
    super(props);
    this.state = {
      start_date: props.bet.start_date,
      end_date: props.bet.end_date,
      value: props.bet.value,
      id: props.bet.id,
    }
    this.changeStart = this.changeStart.bind(this);
    this.changeEnd = this.changeEnd.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }


  changeStart(_, data) {
    this.setState({start_date: data.value}, this.update)
  }

  update = debounce(() => {
    this.props.updateCallback(this.state);
  }, 500);

  changeEnd(_, data) {
    this.setState({end_date: data.value}, this.update)
  }

  changeValue(event) {
    this.setState({value: event.target.value}, this.update)
  }

  render() {
    const months = range(24).map(i => {
      const date = moment("2017-01-01").startOf("year").add(i, 'months');
      return {text: date.format("MMMM YYYY"), value: date.format()}
    });

    const endMonths = range(24).map(i => {
      const date = moment("2017-01-01").startOf("year").add(i, 'months').endOf("month").startOf("day");
      return {text: date.format("MMMM YYYY"), value: date.format()}
    });

    endMonths.push({text: "--", value: null})

    const {start_date, end_date, value} = this.state;

    return (
    <div>
      <label> Start:
        <Dropdown selection
                  name="start_date"
                  defaultValue={moment(start_date).format()}
                  onChange={this.changeStart}
                  options={months}
                  />
      </label>
      <label> Ende:
        <Dropdown selection
                  defaultValue={moment(end_date).format()}
                  onChange={this.changeEnd}
                  options={endMonths}
        />
      </label>
      <label> Betrag:
        <input type="number" value={value} onChange={this.changeValue}/>
      </label>
      { this.props.bet.id && <button onClick={() => this.props.deleteCallback(this.props.bet.id)}> Löschen </button>}
    </div>
    )
  }

}

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
      toast.success("Gebot aktualisiert",  '', {timeOut: 500})
    })
  }

  render() {
    const betsWithNew = this.state.bets.concat({});
    const bets = betsWithNew.map(bet => <Bet key={bet.id}
                                                 bet={bet}
                                                 deleteCallback={this.deleteBet}
                                                 updateCallback={this.updateBet}
    />);
    return <div>{bets}</div>
  }
}



class ShareOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            share: {},
            deposits: [],
          editName: false,
        };

        this.toggleEdit = this.toggleEdit.bind(this);
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

    updateName = (_, v) => {
      const share = this.state.share;
      share.name = v.value;
      this.setState({share: share});
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

    toggleEdit(){
      this.setState({editName: !this.state.editName}, () => {
        if (!this.state.editName) {
          this.sendUpdate(this.state.share);
        }
      });
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
            <div>
                <Header>
                  {this.state.editName?
                    <Input value={this.state.share.name}
                           onChange={this.updateName}
                           style={{minWidth: "50%"}}
                    />
                    : this.state.share.name
                  }
                  <Button onClick={this.toggleEdit}
                          icon="edit"
                          content={this.state.editName ? "Speichern" : "Bearbeiten"} />

                </Header>
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


            </div>
        );
    }
}


class SendEmail extends Component {
    sendDifference = () => {
        window.location.href = Email.getDifferenceText(this.props.share, this.props.deposits) + this.makeCC();
    };

    sendMissing = () => {
        window.location.href =  Email.getMissingText(this.props.share) + this.makeCC();
    };


    makeCC = () => {
        const ccAddresses = this.state.users.filter(user => user.selected).map(user => user.email);
        return "&cc=" + ccAddresses.join(",");
    }

    selectUser = (toggleUser) => {
        this.setState({
            users: this.state.users.map(user => {
                user.selected = user === toggleUser ? !user.selected : user.selected;
                return user;
            })
        })
    }


    constructor(){
        super()
        this.state = {users: [{"email": "knut@k-nut.eu"}, {"email": "peter@example.com"}]}
    }

    componentDidMount(){
        Api.getUserEmails().then(response => this.setState({users: response.users}));
    }

    render () {
        if (!this.props.share.email) {
            return <div> Wenn du oben eine E-Mail Adresse hinzufügst kannst du hier vorformulierte E-Mails senden</div>
        }

        const userList = this.state.users.map(user => {
            return <Checkbox style={{display: "block"}}
                             label={user.email}
                             checked={user.selected}
                             onClick={() => this.selectUser(user)}/>;
        })

        return <div>
                <Header sub={true}> CC setzen </Header>
                {userList}
                <div style={{marginTop: "1em"}}>
                    <Button content="Unstimmigkeit"
                            onClick={this.sendDifference}
                            icon="mail"/>

                    <Button content="Fehlender Beitrag"
                            onClick={this.sendMissing}
                            icon="mail"/>
                </div>
            </div>
    }
}


export default ShareOverview;
