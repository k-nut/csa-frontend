import React, { FunctionComponent } from "react";
import { Loader, Table } from "semantic-ui-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../services/Api";
import { groupBy, sortBy, sumBy } from "lodash";
import Deposit, { ChangeSet } from "./Deposit";
import { Deposit as DepositModel } from "../models";
import NewDeposit from "./NewDeposit";
import moment from "moment";
import YearlySum, { YearlySumModel } from "./YearlySum";

type DepositsComponentProps = {
  shareId: string;
};

type TableRow =
  | { type: "deposit"; value: DepositModel }
  | { type: "yearlySum"; value: YearlySumModel };

const DepositsComponent: FunctionComponent<DepositsComponentProps> = ({
  shareId,
}) => {
  const queryClient = useQueryClient();
  const queryKey = ["deposits", shareId];
  const { data, isLoading } = useQuery(queryKey, () =>
    Api.getShareDeposits(shareId)
  );

  const updateMutation = useMutation(
    ({ id, changeSet }: { id: number; changeSet: ChangeSet }) =>
      Api.patchDeposit(id, changeSet),
    {
      onSuccess: () => queryClient.invalidateQueries(queryKey),
    }
  );

  const realDeposits = (data || []).filter(
    (entry) => !entry.ignore && !entry.is_security
  );
  const byYear = groupBy(realDeposits, (d) => moment(d.timestamp).year());
  const sums = Object.fromEntries(
    Object.entries(byYear).map(([year, deposits]) => [
      year,
      sumBy(deposits, "amount"),
    ])
  );

  const rows: TableRow[] = sortBy(data || [], "timestamp")
    .reduce((values, deposit, currentIndex, array) => {
      const currentYear = moment(deposit.timestamp).year();
      const baseValues = [
        ...values,
        { type: "deposit" as const, value: deposit },
      ];
      if (currentYear !== moment(array[currentIndex + 1]?.timestamp).year()) {
        return [
          ...baseValues,
          {
            type: "yearlySum" as const,
            value: { year: currentYear, total: sums[currentYear] },
          },
        ];
      }
      return baseValues;
    }, [] as TableRow[])
    .reverse();

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Table.Body>
        {rows.map((row) => {
          return row.type === "deposit" ? (
            <Deposit
              key={row.value.id}
              deposit={row.value}
              onChange={(changeSet) =>
                updateMutation.mutate({ id: row.value.id, changeSet })
              }
            />
          ) : (
            <YearlySum value={row.value} />
          );
        })}
      </Table.Body>
      <Table.Footer>
        <NewDeposit
          personName={realDeposits[0].person_name}
          personId={realDeposits[0].person_id}
          queryKey={queryKey}
        />
      </Table.Footer>
    </>
  );
};

export default DepositsComponent;
