import React, { FunctionComponent } from "react";
import { Loader, Table } from "semantic-ui-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Api from "../services/Api";
import { sortBy } from "lodash";
import Deposit, { ChangeSet } from "./Deposit";
import NewDeposit from "./NewDeposit";

type DepositsComponentProps = {
  shareId: string;
};

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

  const deposits = sortBy(data || [], "timestamp").reverse();
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Table.Body>
        {deposits.map((deposit) => (
          <Deposit
            key={deposit.id}
            deposit={deposit}
            onChange={(changeSet) =>
              updateMutation.mutate({ id: deposit.id, changeSet })
            }
          />
        ))}
      </Table.Body>
      <Table.Footer>
        <NewDeposit
          personName={deposits[0].person_name}
          personId={deposits[0].person_id}
          queryKey={queryKey}
        />
      </Table.Footer>
    </>
  );
};

export default DepositsComponent;
