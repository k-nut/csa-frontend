import React, { Component } from "react";
import moment from "moment";
import Api from "../Api";
import Table from "semantic-ui-react/dist/es/collections/Table/Table";
import DatePicker from "react-datepicker/es";
import { Button, Checkbox, Input } from "semantic-ui-react";

class EditDeposit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timestamp: moment(),
      person_id: props.personId
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleChange = date => {
    this.setState({ timestamp: date });
  };

  submit = () => {
    const deposit = this.state;
    deposit.timestamp = moment(deposit.timestamp).format("YYYY-MM-DD");
    Api.addDeposit(deposit);
    this.setState({
      timestamp: moment(),
      amount: 0,
      title: "",
      ignore: null,
      is_security: null
    });
    this.props.updateFunction();
  };

  handleInputChange(_, target) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const disableButton = !this.state.amount || !this.state.title;
    return (
      <Table.Row>
        <Table.Cell>
          <DatePicker
            dateFormat="DD.MM.YYYY"
            selected={this.state.timestamp}
            onChange={this.handleChange}
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            value={this.state.amount}
            onChange={this.handleInputChange}
            type="number"
            name="amount"
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            value={this.state.title}
            onChange={this.handleInputChange}
            name="title"
          />
        </Table.Cell>
        <Table.Cell> {this.props.personName} </Table.Cell>
        <Table.Cell>
          <Checkbox
            checked={this.state.ignore}
            onChange={this.handleInputChange}
            name="ignore"
          >
            {" "}
          </Checkbox>
        </Table.Cell>
        <Table.Cell>
          <Checkbox
            checked={this.state.is_security}
            onChange={this.handleInputChange}
            name="is_security"
          >
            {" "}
          </Checkbox>
          <Button onClick={this.submit} disabled={disableButton}>
            Hinzufügen
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default EditDeposit;
