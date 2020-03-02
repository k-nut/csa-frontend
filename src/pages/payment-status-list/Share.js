import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import React from "react";

export function Share(props) {
  const state = props.share.difference_today < 0 ? "negative" : "positive";
  return (
    <Table.Row className="share" warning={props.share.archived}>
      <Table.Cell>
        <Link to={`/share/${props.share.id}`}>
          {props.share.name || <i> Unbenannter Anteil </i>}
        </Link>
      </Table.Cell>
      <Table.Cell> {props.share.note} </Table.Cell>
      <Table.Cell> {props.share.station_name} </Table.Cell>
      <Table.Cell> {props.share.number_of_deposits} </Table.Cell>
      <Table.Cell> {props.share.expected_today} </Table.Cell>
      <Table.Cell> {props.share.total_deposits} </Table.Cell>
      <Table.Cell className={state}>
        {" "}
        {props.share.difference_today}{" "}
      </Table.Cell>
    </Table.Row>
  );
}
