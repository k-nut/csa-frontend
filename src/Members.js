import React, { Component } from "react";
import { Input, Table } from "semantic-ui-react";
import Api from "./Api";
import EditableField from "./EditableField";
import EditableDropdown from "./EditableDropdown";
import _ from "lodash";

class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: props.member
    };
  }
  updateMember(field, value) {
    const { member } = this.state;
    Api.patchMember(member.id, { [field]: value }).then(response =>
      this.setState({ member: response.member })
    );
    this.props.onChange();
  }

  render() {
    const { member, shares } = this.props;
    return (
      <Table.Row>
        <Table.Cell>
          <EditableField
            value={member.name}
            onSave={value => this.updateMember("name", value)}
          />
        </Table.Cell>
        <Table.Cell>
          <EditableField
            value={member.email}
            onSave={value => this.updateMember("email", value)}
          />
        </Table.Cell>
        <Table.Cell>
          <EditableField
            value={member.phone}
            onSave={value => this.updateMember("phone", value)}
          />
        </Table.Cell>
        <Table.Cell>
          <EditableDropdown
            shares={shares}
            value={member.share_id}
            onSave={value => this.updateMember("share_id", value)}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

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
  }

  async componentDidMount() {
    await this.loadShares();
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
                onChange={this.loadShares}
              />
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default Members;
