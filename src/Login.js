import React from "react";
import { Form } from "semantic-ui-react";

import Api from "./Api";
import toast from "./Toast";
import AuthState from "./AuthState";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.login = this.login.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  login() {
    const authState = new AuthState();

    Api.login(this.state.email, this.state.password)
      .then(({ access_token, id }) => {
        authState.setToken(access_token, id);
        this.props.history.push("/");
      })
      .catch(() => {
        toast.error("Login fehlgeschlagen");
      });
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    return (
      <Form onSubmit={this.login}>
        <Form.Input
          label="E-Mail"
          onChange={this.setEmail}
          value={this.state.email}
        />
        <Form.Input
          label="Password"
          type="password"
          onChange={this.setPassword}
          value={this.state.password}
        />
        <Form.Button type="submit">Anmelden</Form.Button>
      </Form>
    );
  }
}
