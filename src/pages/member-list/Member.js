import { Table } from "semantic-ui-react";
import moment from "moment";
import React from "react";
import styled from "styled-components";

const BorderCell = styled.td`
  ${({ stationIndex }) =>
    stationIndex % 2 === 0 && "border-left 3px solid black;"};
  width: 5%;
`;

export function Member({ member, stationIndex }) {
  return (
    <Table.Row>
      <BorderCell stationIndex={stationIndex}> {stationIndex + 1}</BorderCell>
      <Table.Cell> {member.name}</Table.Cell>
      <Table.Cell> {member.email} </Table.Cell>
      <Table.Cell> {member.phone} </Table.Cell>
      <Table.Cell>
        {member.join_date
          ? moment(member.join_date).format("DD. MMM YYYY")
          : ""}
      </Table.Cell>
    </Table.Row>
  );
}
