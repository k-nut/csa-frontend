import React, { FunctionComponent } from "react";
import { Checkbox, Icon, Label, Table } from "semantic-ui-react";
import moment from "moment";
import { Deposit } from "../models";

export type ChangeSet = Partial<Pick<Deposit, "ignore" | "is_security">>;

type DepositComponentProps = {
  deposit: Deposit;
  onChange: (changeSet: ChangeSet) => void;
};

const DepositComponent: FunctionComponent<DepositComponentProps> = ({
  deposit,
  onChange,
}) => {
  return (
    <Table.Row
      className={deposit.ignore || deposit.is_security ? "ignored" : ""}
    >
      <Table.Cell>{moment(deposit.timestamp).format("DD.MM.YYYY")}</Table.Cell>
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
      <Table.Cell>
        <Checkbox
          checked={deposit.ignore}
          onChange={(_, props) => onChange({ ignore: props.checked })}
        />
      </Table.Cell>
      <Table.Cell>
        <Checkbox
          checked={deposit.is_security}
          onChange={(_, props) => onChange({ is_security: props.checked })}
        />
      </Table.Cell>
    </Table.Row>
  );
};

export default DepositComponent;
