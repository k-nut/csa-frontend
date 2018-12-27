import React, { Component } from "react";
import Api from "./Api";
import { Table } from "semantic-ui-react";

class NewMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      member: {}
    };
    this.save = this.save.bind(this);
  }

  async save() {
    const { onSave } = this.props;
    const { member } = this.state;
    await Api.createMember(member).then(onSave);
    this.setState({ member: { name: "", phone: "", email: "" } });
  }

  updateMember(field, value, x) {
    this.setState(prevState => ({
      member: {
        ...prevState.member,
        [field]: value
      }
    }));
  }

  render() {
    const { member } = this.state;
    return (
      <Table.Row>
        <Table.Cell>
          <input
            value={member.name}
            onChange={event => this.updateMember("name", event.target.value)}
          />
        </Table.Cell>
        <Table.Cell>
          <input
            value={member.email}
            onChange={event => this.updateMember("email", event.target.value)}
          />
        </Table.Cell>
        <Table.Cell>
          <input
            value={member.phone}
            onChange={event => this.updateMember("phone", event.target.value)}
          />
        </Table.Cell>
        <Table.Cell>
          <button onClick={this.save}>hinzufügen</button>
        </Table.Cell>
      </Table.Row>
    );
  }
}
export default NewMember;
