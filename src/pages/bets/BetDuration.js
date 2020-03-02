import moment from "moment";
import React from "react";

export function BetDuration({ bet }) {
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
