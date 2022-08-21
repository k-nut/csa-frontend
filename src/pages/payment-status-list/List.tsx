import React, { FunctionComponent } from "react";
import _ from "lodash";
import { Checkbox, Input, Loader, Table } from "semantic-ui-react";
import Api from "../../services/Api";
import { filterNameAndStation } from "../../services/Utils";
import { Share } from "./Share";
import { useQuery } from "@tanstack/react-query";
import PaymentOverview from "./PaymentOverview";
import styled from "styled-components";
import { BooleanParam, StringParam, useQueryParam } from "use-query-params";

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
`;

const List: FunctionComponent = () => {
  const { data, isLoading } = useQuery(["shares"], Api.getSharesPayments);
  const shares = data || [];

  const [nameFilter, setNameFilter] = useQueryParam("name", StringParam);
  const [filterProblems, setFilterProblems] = useQueryParam(
    "filterProblems",
    BooleanParam
  );
  const [showArchived, setShowArchived] = useQueryParam(
    "showArchived",
    BooleanParam
  );

  const filteredShares = _.chain(shares)
    .filter(filterNameAndStation(nameFilter))
    .filter((share) => {
      if (filterProblems) {
        return share.difference_today < 0;
      }
      return true;
    })
    .filter((share) => {
      if (!showArchived) {
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
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            placeholder="Filter..."
          />
          <Checkbox
            checked={Boolean(filterProblems)}
            onChange={(_, data) => setFilterProblems(data.checked)}
            label="Nur Fehlbeträge zeigen"
          />
          <Checkbox
            checked={Boolean(showArchived)}
            onChange={(_, data) => setShowArchived(data.checked)}
            label="Archivierte anzeigen"
          />
        </div>
        <PaymentOverview shares={filteredShares} />
      </HeaderRow>
      <Table celled className="stickytable">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> ID </Table.HeaderCell>
            <Table.HeaderCell> Namen </Table.HeaderCell>
            <Table.HeaderCell> Notiz </Table.HeaderCell>
            <Table.HeaderCell> Abholstelle </Table.HeaderCell>
            <Table.HeaderCell> Zahlungen </Table.HeaderCell>
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
