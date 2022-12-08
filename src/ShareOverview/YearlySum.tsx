import React, { FunctionComponent } from "react";
import { Table } from "semantic-ui-react";

export type YearlySumModel = {
  year: number;
  total: number;
};

type YearlySumComponentProps = {
  value: YearlySumModel;
};

const YearlySumComponent: FunctionComponent<YearlySumComponentProps> = ({
  value,
}) => {
  return (
    <Table.Row>
      <Table.Cell>
        <b>{value.year} (Summe) </b>
      </Table.Cell>
      <Table.Cell>
        <b>{value.total}</b>
      </Table.Cell>
      <Table.Cell> </Table.Cell>
      <Table.Cell> </Table.Cell>
      <Table.Cell> </Table.Cell>
      <Table.Cell> </Table.Cell>
    </Table.Row>
  );
};

export default YearlySumComponent;
