import React, { Component } from "react";
import Api from "../../services/Api";
import { Table } from "semantic-ui-react";
import EditableField from "../../components/EditableField";
import EditableDropdown from "../../components/EditableDropdown";
import { PlainButton } from "../../components/PlainButton";
import styled from "styled-components";

const LastCell = styled(Table.Cell)`
  display: flex;
  justify-content: space-between;

  ${PlainButton} {
    visibility: hidden;
  }

  &:hover ${PlainButton} {
    visibility: visible;
  }
`;

export class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: props.member
    };
    this.deleteMember = this.deleteMember.bind(this);
  }

  updateMember(field, value) {
    const { member } = this.state;
    Api.patchMember(member.id, { [field]: value }).then(response =>
      this.setState({ member: response.member })
    );
    this.props.onChange();
  }

  deleteMember() {
    const { member } = this.props;
    Api.deleteMember(member.id).then(this.props.onChange);
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
        <LastCell>
          <EditableDropdown
            shares={shares}
            value={member.share_id}
            onSave={value => this.updateMember("share_id", value)}
          />
          <PlainButton onClick={this.deleteMember}> 🗑 </PlainButton>
        </LastCell>
      </Table.Row>
    );
  }
}
