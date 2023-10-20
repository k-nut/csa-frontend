import React, { FunctionComponent, useState } from "react";
import Api from "../services/Api";
import DatePicker from "react-datepicker";
import { Button, Checkbox, Input, Table } from "semantic-ui-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type NewDepositProps = {
  queryKey: string[];
  personName: string;
  personId: number;
};

const NewDeposit: FunctionComponent<NewDepositProps> = ({
  queryKey,
  personName,
  personId,
}) => {
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

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async () => {
      // This should never happen, users cannot submit the form while there is no timestamp.
      if (!timestamp) {
        return;
      }
      return Api.addDeposit({
        amount,
        ignore,
        is_security: isSecurity,
        timestamp: timestamp.toISOString(),
        person_id: personId,
        title,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
        resetState();
      },
    }
  );

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
        <Button
          onClick={() => mutation.mutate()}
          disabled={!amount || !title || !timestamp}
        >
          Hinzufügen
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default NewDeposit;
