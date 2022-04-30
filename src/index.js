import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/browser";

const rootEl = document.getElementById("root");

if (process.env.REACT_APP_SENTRY_DSN && process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

ReactDOM.render(<App />, rootEl);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}
