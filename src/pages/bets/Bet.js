import _ from "lodash";
import { Dropdown, Input, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { BetDuration } from "./BetDuration";
import React from "react";

export function Bet({ share, stations, changeProperty }) {
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
