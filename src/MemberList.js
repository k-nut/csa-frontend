import React, { Component, Fragment } from "react";
import _ from "lodash";
import { Table, Header } from "semantic-ui-react";
import Api from "./Api";
import styled from "styled-components";
import "./MemberList.print.css";

const BorderCell = styled(Table.Cell)`
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
      <Table.Cell> {member.station_name} </Table.Cell>
    </Table.Row>
  );
}

function StationWithMembers({ members, station }) {
  const byShare = _.groupBy(members, "share_id");
  const grouped = _.values(byShare);
  const withColor = _.flatMap(grouped, (group, index) => {
    return group.map(member =>
      Object.assign({}, member, {
        stationIndex: index
      })
    );
  });
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
        <Table.HeaderCell> Abholstelle </Table.HeaderCell>
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

    return <Container>{stations}</Container>;
  }
}

export default MemberList;
