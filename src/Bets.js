import React, { Component } from "react";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";

import {Input, Table, Dropdown, Loader, Checkbox} from "semantic-ui-react";
import Api from "./Api";
import toast from "./Toast";
import { filterNameAndStation } from "./Utils";
import * as queryString from "query-string";

class Bets extends Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(props.location.search);

    this.state = {
      shares: [],
      nameFilter: params.nameFilter,
      newShare: {},
      stations: [],
      showArchived: params.showArchived
    };

    this.handleChange = this.handleChange.bind(this);
    this.changeProperty = this.changeProperty.bind(this);
    this.showArchived = this.showArchived.bind(this);
    this.syncState = this.syncState.bind(this);
  }

  handleChange(event) {
    this.setState({ nameFilter: event.target.value }, this.syncState);
  }

  componentDidMount() {
    function keyById(stations) {
      return _.reduce(
        stations,
        (acc, station) => {
          acc[station.id] = station.name;
          return acc;
        },
        {}
      );
    }

    Promise.all([Api.getShares(), Api.getStations()]).then(
      ([shares, stations]) => {
        const keyedStations = keyById(stations);

        const newShares = shares.map(share => {
          share.station_name = keyedStations[share.station_id];
          return share;
        });

        this.setState({
          shares: newShares,
          stations: _.sortBy(stations, "name")
        });
      }
    );
  }

  changeExistingShare(share, property, value) {
    share[property] = value;
    return Api.updateShare(share).then(updatedShare => {
      const newShares = _.cloneDeep(this.state.shares);
      const index = _.findIndex(newShares, share);
      newShares[index] = updatedShare;
      this.setState({ shares: newShares });
      toast.success(`${updatedShare.name} aktualisiert!`, "", { timeOut: 500 });
    });
  }

  syncState() {
    const currentstate = queryString.parse(this.props.location.search);
    currentstate.nameFilter = this.state.nameFilter;
    if (this.state.showArchived) {
      currentstate.showArchived = this.state.showArchived;
    } else {
      delete currentstate.showArchived;
    }
    this.props.history.replace({
      search: `${queryString.stringify(currentstate)}`
    });
  }

  showArchived(event, data) {
    this.setState({ showArchived: data.checked }, this.syncState);
  }

  changeProperty(share, property, value) {
    if (share !== this.state.newShare) {
      this.changeExistingShare(share, property, value);
    } else {
      share[property] = value;
      this.setState({ newShare: share });
      if (
        share.station_id &&
        share.name &&
        share.start_date &&
        share.bet_value
      ) {
        return Api.updateShare(share).then(updatedShare => {
          const newShares = this.state.shares.concat(updatedShare);
          this.setState({
            shares: newShares,
            newShare: { name: "" }
          });
          toast.success(`${updatedShare.name} erstellt!`, "", { timeOut: 500 });
        });
      }
    }
  }

  render() {
    const shares = _.chain(this.state.shares)
      .filter(filterNameAndStation(this.state.nameFilter))
      .filter(share => (this.state.showArchived ? true : !share.archived))
      .sortBy(["station_id", "name"])
      .map(share => {
        return (
          <Bet
            share={share}
            stations={this.state.stations}
            changeProperty={this.changeProperty}
            key={share.id}
          />
        );
      })
      .value();
    return (
      <div>
        <div className="spaced">
          <Input
            value={this.state.nameFilter}
            onChange={this.handleChange}
            placeholder="Filter..."
          />
          <Checkbox
            checked={this.state.showArchived}
            onChange={this.showArchived}
            label="Archivierte anzeigen"
          />
        </div>
        <Table celled className="stickytable">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell> Name </Table.HeaderCell>
              <Table.HeaderCell> Notiz </Table.HeaderCell>
              <Table.HeaderCell> Abholstelle </Table.HeaderCell>
              <Table.HeaderCell> Gebote </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {this.state.shares.length ? (
            <Table.Body>{shares}</Table.Body>
          ) : (
            <Loader active inline="centered" />
          )}
          <Table.Footer style={{ backgroundColor: "rgba(82, 189, 82, 0.21)" }}>
            <Bet
              share={this.state.newShare}
              stations={this.state.stations}
              changeProperty={this.changeProperty}
            />
          </Table.Footer>
        </Table>
      </div>
    );
  }
}

function BetDuration({ bet }) {
  if (bet.end_date) {
    return (
      <div>
        {moment(bet.start_date).format("MMM YY")} -{" "}
        {moment(bet.end_date).format("MMM YY")}: <b>{bet.value}€</b>
      </div>
    );
  }
  return (
    <div>
      Ab {moment(bet.start_date).format("MMM YY")}: <b>{bet.value}€</b>
    </div>
  );
}

function Bet({ share, stations, changeProperty }) {
  const changeNote = _.debounce((_, v) => {
    changeProperty(share, "note", v.value);
  }, 500);

  const changeName = _.debounce((_, v) => {
    changeProperty(share, "name", v.value);
  }, 500);

  const changeStation = (_, values) => {
    changeProperty(share, "station_id", values.value);
  };

  stations = stations.map(station => {
    station.value = station.id;
    station.text = station.name;
    return station;
  });

  return (
    <Table.Row warning={share.archived}>
      <Table.Cell>
        {share.id ? (
          <Link to={`/share/${share.id}`}>{share.name}</Link>
        ) : (
          <div>
            {" "}
            Neu: <Input defaultValue={share.name} onChange={changeName} />
          </div>
        )}
      </Table.Cell>
      <Table.Cell>
        <Input defaultValue={share.note} onChange={changeNote} />
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          selection
          defaultValue={share.station_id}
          options={stations}
          onChange={changeStation}
        />
      </Table.Cell>
      <Table.Cell>
        {share.bets
          ? share.bets.map(bet => <BetDuration key={bet.id} bet={bet} />)
          : ""}
      </Table.Cell>
    </Table.Row>
  );
}
export default Bets;
