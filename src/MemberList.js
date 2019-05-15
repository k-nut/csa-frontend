import React, { Component, Fragment } from "react";
import _ from "lodash";
import { Table } from "semantic-ui-react";
import Api from "./Api";
import styled from "styled-components";
import "./MemberList.print.css";
import moment from "moment";
import sortBy from "lodash/fp/sortBy";
import groupBy from "lodash/fp/groupBy";
import values from "lodash/fp/values";
import flow from "lodash/fp/flow";

const BorderCell = styled.td`
  ${({ stationIndex }) =>
    stationIndex % 2 === 0 && "border-left 3px solid black;"};
  width: 5%;
`;

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

function Member({ member, stationIndex }) {
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

function StationWithMembers({ members, station }) {
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

function TableHeader() {
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

const Container = styled.div`
  padding: 20px;
`;

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    };
  }

  componentDidMount() {
    Api.getMembers({ active: true }).then(({ members }) =>
      this.setState({ members })
    );
  }

  render() {
    const { members } = this.state;
    const byStation = _.groupBy(members, "station_name");

    const stations = _.map(byStation, (value, key) => (
      <StationWithMembers members={value} station={key} key={key} />
    ));

    return (
      <Container>
        {_.sortBy(stations, station => station.key.toLowerCase())}
      </Container>
    );
  }
}

export default MemberList;
