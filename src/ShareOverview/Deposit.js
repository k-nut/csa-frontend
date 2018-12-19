import React, { Component } from "react";
import { Checkbox, Icon, Label } from "semantic-ui-react";
import Table from "semantic-ui-react/dist/es/collections/Table/Table";
import moment from "moment";
import PropTypes from "prop-types";

class Deposit extends Component {
  changeSecurity = (_, data) => {
    this.props.changeFunction(this.props.deposit, "is_security", data.checked);
  };

  changeIgnore = (_, data) => {
    this.props.changeFunction(this.props.deposit, "ignore", data.checked);
  };

  render() {
    const deposit = this.props.deposit;
    const ignore = (
      <Checkbox checked={deposit.ignore} onChange={this.changeIgnore}>
        {" "}
      </Checkbox>
    );
    const security = (
      <Checkbox checked={deposit.is_security} onChange={this.changeSecurity}>
        {" "}
      </Checkbox>
    );
    return (
      <Table.Row
        className={deposit.ignore || deposit.is_security ? "ignored" : ""}
      >
        <Table.Cell>
          {" "}
          {moment(deposit.timestamp).format("DD.MM.YYYY")}{" "}
        </Table.Cell>
        <Table.Cell> {deposit.amount} </Table.Cell>
        <Table.Cell>
          {deposit.title}
          {deposit.added_by_email && (
            <Label>
              <Icon name="write" />
              Manuell hinzugefügt von: {deposit.added_by_email}
            </Label>
          )}
        </Table.Cell>
        <Table.Cell> {deposit.person_name} </Table.Cell>
        <Table.Cell>{ignore}</Table.Cell>
        <Table.Cell>{security}</Table.Cell>
      </Table.Row>
    );
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
    person_name: PropTypes.string
  }),
  changeFunction: PropTypes.func
};

export default Deposit;
