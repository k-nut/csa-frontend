import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Checkbox, Input, Loader, Table } from "semantic-ui-react";
import Api from "../../services/Api";
import { filterNameAndStation } from "../../services/Utils";
import { useHistory, useLocation } from "react-router";
import { Share } from "./Share";

type ShareModel = any;

// Taken from the react-router documentation
function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function List() {
  const query = useQuery();
  const history = useHistory();
  const [shares, setShares] = useState<ShareModel[]>([]);

  useEffect(() => {
    Api.getSharesPayments().then(setShares);
  }, []);

  const updateUrl = (key: string, value: string | boolean | undefined) => {
    if (!value) {
      query.delete(key);
    } else if (typeof value === "boolean") {
      if (value) {
        query.set(key, "true");
      } else {
        query.delete(key);
      }
    } else {
      query.set(key, value);
    }
    history.replace({
      search: query.toString(),
    });
  };

  const filteredShares = _.chain(shares)
    .filter(filterNameAndStation(query.get("name")))
    .filter((share) => {
      if (query.get("filterProblems")) {
        return share.difference_today < 0;
      }
      return true;
    })
    .filter((share) => {
      if (!query.get("showArchived")) {
        return !share.archived;
      }
      return true;
    })
    .sortBy(["station_name", "name"])
    .map((share) => {
      return <Share share={share} key={share.id} />;
    })
    .value();
  return (
    <div>
      <div className="spaced">
        <Input
          value={query.get("name")}
          onChange={(event) => updateUrl("name", event.target.value)}
          placeholder="Filter..."
        />
        <Checkbox
          checked={Boolean(query.get("filterProblems"))}
          onChange={(_, data) => updateUrl("filterProblems", data.checked)}
          label="Nur Fehlbeträge zeigen"
        />
        <Checkbox
          checked={Boolean(query.get("showArchived"))}
          onChange={(_, data) => updateUrl("showArchived", data.checked)}
          label="Archivierte anzeigen"
        />
      </div>
      {/*// @ts-ignore*/}
      <Table celled className="stickytable">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> Namen </Table.HeaderCell>
            <Table.HeaderCell> Notiz </Table.HeaderCell>
            <Table.HeaderCell> Abholstelle </Table.HeaderCell>
            <Table.HeaderCell> Zahlungen </Table.HeaderCell>
            <Table.HeaderCell> Erwartet </Table.HeaderCell>
            <Table.HeaderCell> Kontostand </Table.HeaderCell>
            <Table.HeaderCell> Differenz </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredShares.length ? (
            filteredShares
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7}>
                <Loader active inline="centered" />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default List;
