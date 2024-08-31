import { Table } from "semantic-ui-react";
import React from "react";

export function TableHeader() {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell> Nummer </Table.HeaderCell>
        <Table.HeaderCell> Name </Table.HeaderCell>
        <Table.HeaderCell> E-Mail </Table.HeaderCell>
        <Table.HeaderCell> Telefon </Table.HeaderCell>
        <Table.HeaderCell> Beitrittsdatum </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
}
