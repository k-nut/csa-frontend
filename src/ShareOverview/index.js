import React, { Component } from "react";
import { Button, Form, Header, Table } from "semantic-ui-react";
import Api from "../services/Api";
import { debounce, sortBy } from "lodash";
import "./ShareOverview.css";
import "react-datepicker/dist/react-datepicker.css";
import toast from "../components/Toast";
import MergeShare from "./MergeShare";
import Bets from "./Bets";
import SendEmail from "./SendEmail";
import Deposit from "./Deposit";
import NewDeposit from "./NewDeposit";

import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

class ShareOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      share: {},
      deposits: [],
    };
  }

  componentDidMount() {
    Api.getShare(this.props.match.params.id).then((share) => {
      this.setState({ share });
    });
    Api.getShareDeposits(this.props.match.params.id).then((deposits) => {
      this.setState({ deposits });
    });
  }

  updateNote = (_, v) => {
    const share = this.state.share;
    share.note = v.value;
    this.setState({ share: share });
    this.sendUpdate(this.state.share.id, v.value);
  };

  changeDeposit = (id, changeSet) => {
    this.setState({
      deposits: this.state.deposits.map((deposit) =>
        deposit.id === id ? { ...deposit, ...changeSet } : deposit
      ),
    });
    Api.patchDeposit(id, changeSet);
  };

  toggleArchivedState = () => {
    Api.patchShare(this.state.share.id, {
      archived: !this.state.share.archived,
    }).then(() => {
      this.props.history.push("/");
    });
  };

  sendUpdate = debounce((id, note) => {
    Api.patchShare(id, { note }).then(() => {
      toast.success("Anteil aktualisiert", "", { timeOut: 500 });
    });
  }, 500);

  render() {
    const deposits = sortBy(this.state.deposits, "timestamp")
      .reverse()
      .map((deposit) => {
        return (
          <Deposit
            key={deposit.id}
            deposit={deposit}
            onChange={(changeSet) => this.changeDeposit(deposit.id, changeSet)}
          />
        );
      });

    return (
      <Container>
        <Header> {this.state.share.name} </Header>
        <div
          className="spaced"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Form>
            <Form.TextArea
              label="Notiz"
              value={this.state.share.note}
              onChange={this.updateNote}
            />
          </Form>
          <Button
            onClick={this.toggleArchivedState}
            color="red"
            icon={this.state.share.archived ? "repeat" : "trash"}
            content={
              this.state.share.archived ? "Wiederherstellen" : "Archivieren"
            }
          />
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
          <Table.Body>{deposits}</Table.Body>
          {this.state.deposits.length > 0 && (
            <Table.Footer>
              <NewDeposit
                personName={this.state.deposits[0].person_name}
                personId={this.state.deposits[0].person_id}
                afterAdd={(newDeposit) =>
                  this.setState({
                    deposits: [...this.state.deposits, newDeposit],
                  })
                }
              />
            </Table.Footer>
          )}
        </Table>

        {this.state.share.id && (
          <div>
            <Header>Gebote</Header>
            <Bets shareId={this.state.share.id} />
          </div>
        )}

        {this.state.share.id && (
          <div>
            <Header>Mit anderem Anteil zusammenführen</Header>
            <MergeShare
              originalShare={this.state.share.id}
              history={this.props.history}
            />
          </div>
        )}

        <Header> E-Mails </Header>

        {this.state.share.id && (
          <SendEmail share={this.state.share} deposits={this.state.deposits} />
        )}
      </Container>
    );
  }
}

export default ShareOverview;
