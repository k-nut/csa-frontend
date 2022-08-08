import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";
import { ShareModel } from "../../services/Api";

interface ShareProps {
  share: ShareModel;
}
export const Share: FunctionComponent<ShareProps> = ({ share }) => {
  const state = share.difference_today < 0 ? "negative" : "positive";
  return (
    <Table.Row className="share" warning={share.archived}>
      <Table.Cell>
        <Link to={`/share/${share.id}`}>
          {share.name || <i> Unbenannter Anteil </i>}
        </Link>
      </Table.Cell>
      <Table.Cell> {share.note} </Table.Cell>
      <Table.Cell> {share.station_name} </Table.Cell>
      <Table.Cell> {share.number_of_deposits} </Table.Cell>
      <Table.Cell> {share.expected_today} </Table.Cell>
      <Table.Cell> {share.total_deposits} </Table.Cell>
      <Table.Cell className={state}>{share.difference_today}</Table.Cell>
    </Table.Row>
  );
};
