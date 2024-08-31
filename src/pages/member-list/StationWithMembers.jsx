import styled from "styled-components";
import flow from "lodash/fp/flow";
import groupBy from "lodash/fp/groupBy";
import values from "lodash/fp/values";
import sortBy from "lodash/fp/sortBy";
import _ from "lodash";
import React, { Fragment } from "react";
import { Table } from "semantic-ui-react";
import { TableHeader } from "./TableHeader";
import { Member } from "./Member";

const ShareHeader = styled.h2`
  :not(:first-of-type) {
    margin-top: 2em !important;
  }
  @media print {
    :not(:first-of-type) {
      margin-top: 0;
      page-break-before: always;
    }
  }
`;

export function StationWithMembers({ members, station }) {
  const grouped = flow(
    groupBy("share_id"),
    values,
    sortBy(x => x[0].join_date)
  )(members);
  const withColor = _.flatMap(grouped, (group, index) =>
    group.map(member => ({ ...member, stationIndex: index }))
  );
  return (
    <Fragment>
      <ShareHeader>
        {station} ({grouped.length} Anteile)
      </ShareHeader>
      <Table>
        <TableHeader />
        <Table.Body>
          {withColor.map(member => (
            <Member
              key={member.id}
              member={member}
              stationIndex={member.stationIndex}
            />
          ))}
        </Table.Body>
      </Table>
    </Fragment>
  );
}
