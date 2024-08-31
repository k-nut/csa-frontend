import React, { Component } from "react";
import _ from "lodash";
import Api from "../../services/Api";
import styled from "styled-components";
import "./MemberList.print.css";
import { StationWithMembers } from "./StationWithMembers";

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
