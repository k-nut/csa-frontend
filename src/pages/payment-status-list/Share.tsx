import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";
import { ShareModel } from "../../services/Api";

interface ShareProps {
  share: ShareModel;
}
const EXPECTED_SECURITY = 120;

export const Share: FunctionComponent<ShareProps> = ({ share }) => {
  const state = share.difference_today < 0 ? "negative" : "positive";
  const securityState =
    share.total_security === EXPECTED_SECURITY ? "positive" : "negative";
  return (
    <Table.Row className="share" warning={share.archived}>
      <Table.Cell>{share.id}</Table.Cell>
      <Table.Cell>
        <Link to={`/share/${share.id}`}>
          {share.name || <i> Unbenannter Anteil </i>}
        </Link>
      </Table.Cell>
      <Table.Cell>
        <div style={{ whiteSpace: "pre-wrap" }}>{share.note}</div>
      </Table.Cell>
      <Table.Cell> {share.station_name} </Table.Cell>
      <Table.Cell className={securityState}>{share.total_security} </Table.Cell>
      <Table.Cell> {share.number_of_deposits}</Table.Cell>
      <Table.Cell className={state}>{share.difference_today}</Table.Cell>
    </Table.Row>
  );
};
