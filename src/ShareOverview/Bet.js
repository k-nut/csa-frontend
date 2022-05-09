import React, { Component } from "react";
import { debounce, range } from "lodash";
import moment from "moment";
import { Button, Input } from "semantic-ui-react";
import DatePicker from "react-datepicker/es";

const toDateString = (dateString) => {
  if (!dateString) {
    return undefined;
  }
  return moment(dateString).format().slice(0, 10);
};

class Bet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: toDateString(props.bet.start_date),
      end_date: toDateString(props.bet.end_date),
      value: props.bet.value,
      id: props.bet.id,
    };
    this.changeStart = this.changeStart.bind(this);
    this.changeEnd = this.changeEnd.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  changeStart(start_date) {
    this.setState({ start_date: toDateString(start_date) });
  }

  changeEnd(end_date) {
    this.setState({ end_date: toDateString(end_date) });
  }

  changeValue(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    const hasChange =
      this.state.start_date !== this.props.bet.start_date ||
      this.state.end_date !== this.props.bet.end_date ||
      this.state.value !== this.props.bet.value;

    const isValidNewBet = this.state.start_date && this.state.value;

    const canAdd = this.props.bet.id ? hasChange : isValidNewBet;

    const months = range(72).map((i) => {
      return moment.utc("2017-01-01").startOf("day").add(i, "months");
    });

    const halfMonths = range(72).map((i) => {
      return moment.utc("2017-01-15").startOf("day").add(i, "months");
    });
    const startDates = [...months, ...halfMonths];

    const endMonths = range(72).map((i) => {
      return moment
        .utc("2017-01-01")
        .add(i, "months")
        .endOf("month")
        .startOf("day");
    });

    const { start_date, end_date, value } = this.state;

    return (
      <div style={{ display: "flex" }}>
        <label>
          Start:
          <DatePicker
            dateFormat="DD.MM.YYYY"
            selected={start_date && moment(start_date)}
            includeDates={startDates}
            onChange={this.changeStart}
            placeholderText="Startdatum"
          />
        </label>
        <label style={{ margin: "0 10px" }}>
          Ende:
          <DatePicker
            dateFormat="DD.MM.YYYY"
            selected={end_date && moment(end_date)}
            includeDates={endMonths}
            onChange={this.changeEnd}
            placeholderText="Enddatum"
          />
        </label>
        <label>
          {" "}
          Betrag:
          <Input type="number" value={value} onChange={this.changeValue} />
        </label>
        <Button
          disabled={!canAdd}
          onClick={() => this.props.updateCallback(this.state)}
          content={this.props.bet.id ? "Aktualiseren" : "Hinzufügen"}
        />
        <Button
          onClick={() => this.props.deleteCallback(this.props.bet.id)}
          content="Löschen"
          disabled={!this.props.bet.id}
        />
      </div>
    );
  }
}

export default Bet;
