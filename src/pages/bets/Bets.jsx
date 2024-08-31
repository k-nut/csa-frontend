import React, { Component } from "react";
import _ from "lodash";

import { Checkbox, Input, Loader, Table } from "semantic-ui-react";
import Api from "../../services/Api";
import toast from "../../components/Toast";
import { filterNameAndStation } from "../../services/Utils";
import * as queryString from "query-string";
import { Bet } from "./Bet";

class Bets extends Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(props.location.search);

    this.state = {
      shares: [],
      nameFilter: params.nameFilter,
      newShare: {},
      stations: [],
      showArchived: params.showArchived,
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

        const newShares = shares.map((share) => {
          share.station_name = keyedStations[share.station_id];
          return share;
        });

        this.setState({
          shares: newShares,
          stations: _.sortBy(stations, "name"),
        });
      }
    );
  }

  changeExistingShare(share, property, value) {
    share[property] = value;
    return Api.updateShare(share).then((updatedShare) => {
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
      search: `${queryString.stringify(currentstate)}`,
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
        return Api.updateShare(share).then((updatedShare) => {
          const newShares = this.state.shares.concat(updatedShare);
          this.setState({
            shares: newShares,
            newShare: { name: "" },
          });
          toast.success(`${updatedShare.name} erstellt!`, "", { timeOut: 500 });
        });
      }
    }
  }

  render() {
    const shares = _.chain(this.state.shares)
      .filter(filterNameAndStation(this.state.nameFilter))
      .filter((share) => (this.state.showArchived ? true : !share.archived))
      .sortBy(["station_id", "name"])
      .map((share) => {
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
        </Table>
      </div>
    );
  }
}

export default Bets;
