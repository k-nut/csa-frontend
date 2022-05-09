import React, { Component } from "react";
import { range } from "lodash";
import moment from "moment";
import { Button, Input } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import { Bet } from "../models";

const toDateString = (input: Date | null | undefined) => {
  if (!input) {
    return undefined;
  }
  return moment(input).format("YYYY-MM-DD");
};

type BetProps = {
  bet: Bet;
  updateCallback: (bet: Bet) => Promise<void>;
  deleteCallback: (id: number) => Promise<void>;
};

type BetState = {
  startDate?: Date | null;
  endDate: Date | null;
  value?: number;
};

class BetComponent extends Component<BetProps, BetState> {
  constructor(props: BetProps) {
    super(props);
    this.state = {
      startDate: props.bet.start_date
        ? moment(props.bet.start_date).toDate()
        : null,
      endDate: props.bet.end_date ? moment(props.bet.end_date).toDate() : null,
      value: props.bet.value,
    };
  }

  render() {
    const hasChange =
      !moment(this.state.startDate).isSame(this.props.bet.start_date, "day") ||
      !moment(this.state.endDate).isSame(this.props.bet.end_date, "day") ||
      this.state.value !== this.props.bet.value;

    const isValidNewBet = this.state.startDate && this.state.value;

    const canAdd = this.props.bet.id ? hasChange : isValidNewBet;

    const months = range(72).map((i) => {
      return moment.utc("2017-01-01").startOf("day").add(i, "months").toDate();
    });

    const halfMonths = range(72).map((i) => {
      return moment.utc("2017-01-15").startOf("day").add(i, "months").toDate();
    });
    const startDates = [...months, ...halfMonths];

    const endMonths = range(72).map((i) => {
      return moment
        .utc("2017-01-01")
        .add(i, "months")
        .endOf("month")
        .startOf("day")
        .toDate();
    });

    const { startDate, endDate, value } = this.state;

    const asAny = (object: any): any => object;

    const onSave = () => {
      this.props.updateCallback({
        id: this.props.bet.id,
        end_date: toDateString(this.state.endDate),
        start_date: asAny(toDateString(this.state.startDate)),
        value: asAny(this.state.value),
        share_id: this.props.bet.share_id,
      });
    };

    return (
      <div style={{ display: "flex" }}>
        <label>
          Start:
          <DatePicker
            dateFormat="dd.MM.yyyy"
            selected={startDate}
            includeDates={startDates}
            onChange={(startDate) => this.setState({ startDate })}
            placeholderText="Startdatum"
          />
        </label>
        <label style={{ margin: "0 10px" }}>
          Ende:
          <DatePicker
            dateFormat="dd.MM.yyyy"
            selected={endDate}
            includeDates={endMonths}
            onChange={(endDate) => this.setState({ endDate })}
            placeholderText="Enddatum"
          />
        </label>
        <label>
          Betrag:
          <Input
            type="number"
            value={value}
            onChange={(event) =>
              this.setState({ value: parseFloat(event.target.value) })
            }
          />
        </label>
        <Button
          disabled={!canAdd}
          onClick={onSave}
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

export default BetComponent;
