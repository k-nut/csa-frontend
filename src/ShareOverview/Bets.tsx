import React, { FunctionComponent } from "react";
import Api from "../services/Api";
import Bet from "./Bet";

import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Bet as BetModel } from "../models";
import moment from "moment";
import { Loader } from "semantic-ui-react";

const BetContainer = styled.div`
  & > div {
    margin-top: 10px;
  }
`;

interface BetsProps {
  shareId: number;
}

const Bets: FunctionComponent<BetsProps> = ({ shareId }) => {
  const { data, isLoading } = useQuery(["bets", shareId], () =>
    Api.getBets(shareId)
  );

  const bets = data || [];

  if (isLoading) {
    return <Loader />;
  }

  const betsWithNew: BetModel[] = bets.concat({
    value: 0,
    share_id: shareId,
    start_date: moment().toISOString(),
  } as BetModel);
  return (
    <BetContainer>
      {betsWithNew
        .sort(
          (a, b) =>
            moment(b.start_date).valueOf() - moment(a.start_date).valueOf()
        )
        .map((bet) => (
          <Bet key={bet.id || "new"} shareId={shareId} bet={bet} />
        ))}
    </BetContainer>
  );
};

export default Bets;
