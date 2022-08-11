import React, { FunctionComponent, useState } from "react";
import { range } from "lodash";
import moment from "moment";
import { Button, Input } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import { Bet } from "../models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Api from "../services/Api";
import toast from "../components/Toast";

const toDateString = (input: Date | null | undefined) => {
  if (!input) {
    return undefined;
  }
  return moment(input).format("YYYY-MM-DD");
};

type BetProps = {
  bet: Bet;
  shareId: number;
};

const BetComponent: FunctionComponent<BetProps> = ({ bet, shareId }) => {
  const { start_date, end_date } = bet;
  const [startDate, setStartDate] = useState(
    start_date ? moment(start_date).toDate() : null
  );
  const [endDate, setEndDate] = useState(
    end_date ? moment(end_date).toDate() : null
  );
  const [value, setValue] = useState(bet.value);
  const queryClient = useQueryClient();

  const deleteBet = useMutation(
    (betId: number) => Api.deleteBet(shareId, betId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bets", shareId]);
      },
    }
  );

  const updateBet = useMutation((bet: Bet) => Api.updateBet(shareId, bet), {
    onSuccess: () => {
      toast.success("Gebot aktualisiert");
      queryClient.invalidateQueries(["bets", shareId]);
    },
  });

  const hasChange =
    !moment(startDate).isSame(bet.start_date, "day") ||
    !moment(endDate).isSame(bet.end_date, "day") ||
    value !== bet.value;

  const isValidNewBet = startDate && value;

  const canAdd = bet.id ? hasChange : isValidNewBet;

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

  const onSave = () => {
    updateBet.mutate({
      id: bet.id,
      end_date: toDateString(endDate),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      start_date: toDateString(startDate)!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: value!,
      share_id: bet.share_id,
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
          onChange={setStartDate}
          placeholderText="Startdatum"
        />
      </label>
      <label style={{ margin: "0 10px" }}>
        Ende:
        <DatePicker
          dateFormat="dd.MM.yyyy"
          selected={endDate}
          includeDates={endMonths}
          onChange={setEndDate}
          placeholderText="Enddatum"
        />
      </label>
      <label>
        Betrag:
        <Input
          type="number"
          value={value}
          onChange={(event) => setValue(parseFloat(event.target.value))}
        />
      </label>
      <Button
        disabled={!canAdd}
        onClick={onSave}
        content={bet.id ? "Aktualiseren" : "Hinzufügen"}
      />
      <Button
        onClick={() => deleteBet.mutate(bet.id)}
        content="Löschen"
        disabled={!bet.id}
      />
    </div>
  );
};

export default BetComponent;
