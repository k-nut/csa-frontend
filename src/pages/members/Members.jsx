import React, { Component } from "react";
import { Input, Table } from "semantic-ui-react";
import _ from "lodash";

import Api from "../../services/Api";
import NewMember from "./NewMember";
import { Member } from "./Member";

class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shares: [],
      members: [],
      nameFilter: ""
    };

    this.loadShares = this.loadShares.bind(this);
    this.updateNameFilter = this.updateNameFilter.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    await this.loadShares();
    await this.loadMembers();
  }

  async loadMembers() {
    const membersResponse = await Api.getMembers();

    this.setState({ members: _.sortBy(membersResponse.members, "name") });
  }

  async loadShares() {
    const shares = await Api.getShares();
    const shareValues = shares.map(share => ({
      value: share.id,
      text: share.name
    }));

    this.setState({ shares: shareValues });
  }

  updateNameFilter(event) {
    this.setState({ nameFilter: event.target.value });
  }

  render() {
    const { members, shares, nameFilter } = this.state;
    const matchNameIgnoreCase = member =>
      member.name &&
      member.name.toLowerCase().indexOf(nameFilter.toLowerCase()) !== -1;
    const filteredMembers = members.filter(matchNameIgnoreCase);

    return (
      <div>
        <div className="spaced">
          <Input
            value={this.state.nameFilter}
            onChange={this.updateNameFilter}
            placeholder="Filter..."
          />
        </div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>E-Mail</Table.HeaderCell>
              <Table.HeaderCell>Telefon</Table.HeaderCell>
              <Table.HeaderCell>Anteil</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredMembers.map(member => (
              <Member
                member={member}
                key={member.id}
                shares={shares}
                onChange={() => {
                  this.loadShares();
                  this.loadMembers();
                }}
              />
            ))}
          </Table.Body>
          <Table.Footer>
            <NewMember onSave={this.componentDidMount} />
          </Table.Footer>
        </Table>
      </div>
    );
  }
}

export default Members;
