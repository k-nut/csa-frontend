import React, { Component } from "react";
import { debounce, range } from "lodash";
import moment from "moment";
import { Button, Input } from "semantic-ui-react";
import DatePicker from "react-datepicker/es";

class Bet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start_date: props.bet.start_date,
      end_date: props.bet.end_date,
      value: props.bet.value,
      id: props.bet.id,
    };
    this.changeStart = this.changeStart.bind(this);
    this.changeEnd = this.changeEnd.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  changeStart(start_date) {
    this.setState(
      { start_date: start_date.format().slice(0, 10) },
      this.update
    );
  }

  changeEnd(end_date) {
    this.setState({ end_date: end_date.format().slice(0, 10) }, this.update);
  }

  changeValue(event) {
    this.setState({ value: event.target.value }, this.update);
  }

  render() {
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
        {this.props.bet.id ? (
          <Button
            onClick={() => this.props.deleteCallback(this.props.bet.id)}
            content="Löschen"
          />
        ) : (
          <Button
            disabled={!(this.state.start_date && this.state.value)}
            onClick={() => this.props.updateCallback(this.state)}
            content="Hinzufügen"
          />
        )}
      </div>
    );
  }
}

export default Bet;
