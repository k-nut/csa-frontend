import { Statistic } from "semantic-ui-react";
import React, { FunctionComponent } from "react";
import { ShareModel as ShareModel } from "../../services/Api";

interface PaymentOverviewProps {
  shares: ShareModel[];
}

const PaymentOverview: FunctionComponent<PaymentOverviewProps> = ({
  shares,
}) => {
  interface Totals {
    positive: number;
    neutral: number;
    negative: number;
  }

  const summary = shares.reduce(
    (totals, share) => {
      if (share.difference_today === 0) {
        return { ...totals, neutral: totals.neutral + 1 };
      }
      if (share.difference_today < 0) {
        return { ...totals, negative: totals.negative + 1 };
      }
      return { ...totals, positive: totals.positive + 1 };
    },
    { positive: 0, negative: 0, neutral: 0 } as Totals
  );

  return (
    <Statistic.Group size="mini">
      <Statistic color="red">
        <Statistic.Value>{summary.negative}</Statistic.Value>
        <Statistic.Label>im minus</Statistic.Label>
      </Statistic>
      <Statistic color="green">
        <Statistic.Value>{summary.neutral}</Statistic.Value>
        <Statistic.Label>ausgeglichen</Statistic.Label>
      </Statistic>
      <Statistic color="teal">
        <Statistic.Value>{summary.positive}</Statistic.Value>
        <Statistic.Label>im plus</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  );
};

export default PaymentOverview;
