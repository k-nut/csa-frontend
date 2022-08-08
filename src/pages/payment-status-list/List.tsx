import React, { FunctionComponent } from "react";
import _ from "lodash";
import { Checkbox, Input, Loader, Table } from "semantic-ui-react";
import Api from "../../services/Api";
import { filterNameAndStation } from "../../services/Utils";
import { useHistory, useLocation } from "react-router";
import { Share } from "./Share";
import { useQuery } from "@tanstack/react-query";
import PaymentOverview from "./PaymentOverview";
import styled from "styled-components";

// Taken from the react-router documentation
function useURlQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
`;

const List: FunctionComponent = () => {
  const query = useURlQuery();
  const history = useHistory();

  const { data, isLoading } = useQuery(["shares"], Api.getSharesPayments);
  const shares = data || [];

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
    .value();
  return (
    <div>
      <HeaderRow>
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
        <PaymentOverview shares={filteredShares} />
      </HeaderRow>
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
          {!isLoading ? (
            filteredShares.map((share) => (
              <Share share={share} key={share.id} />
            ))
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
};

export default List;
