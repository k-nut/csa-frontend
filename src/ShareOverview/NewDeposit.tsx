import React, { useState } from "react";
import Api from "../services/Api";
import DatePicker from "react-datepicker";
import { Button, Checkbox, Input, Table } from "semantic-ui-react";
import { Deposit } from "../models";

type NewDepositProps = {
  afterAdd: (deposit: Deposit) => void;
  personName: string;
};

export default function NewDeposit({ afterAdd, personName }: NewDepositProps) {
  const [timestamp, setTimestamp] = useState<Date | null>(new Date());
  const [title, setTitle] = useState("");
  const [ignore, setIgnore] = useState<boolean | undefined>(false);
  const [isSecurity, setIsSecurity] = useState<boolean | undefined>(false);
  const [amount, setAmount] = useState(0);

  const resetState = () => {
    setTimestamp(new Date());
    setAmount(0);
    setTitle("");
    setIgnore(false);
    setIsSecurity(false);
  };

  const submit = async () => {
    const newDeposit = await Api.addDeposit({
      amount,
      ignore,
      is_security: isSecurity,
      timestamp: timestamp ? timestamp.toISOString() : undefined,
      title,
    });
    afterAdd(newDeposit);
    resetState();
  };

  return (
    <Table.Row>
      <Table.Cell>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          selected={timestamp}
          onChange={(newDate) => setTimestamp(newDate)}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          value={amount}
          onChange={(_, data) => setAmount(parseFloat(data.value))}
          type="number"
          name="amount"
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          value={title}
          onChange={(_, data) => setTitle(data.value)}
          name="title"
        />
      </Table.Cell>
      <Table.Cell> {personName} </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={ignore}
          onChange={(_, data) => setIgnore(data.checked)}
          name="ignore"
        >
          {" "}
        </Checkbox>
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={isSecurity}
          onChange={(_, data) => setIsSecurity(data.checked)}
          name="is_security"
        >
          {" "}
        </Checkbox>
        <Button onClick={submit} disabled={!amount || !title}>
          Hinzufügen
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}
