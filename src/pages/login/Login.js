import React, { useState } from "react";
import { Form } from "semantic-ui-react";

import Api from "../../services/Api";
import toast from "../../components/Toast";
import AuthState from "../../services/AuthState";

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authState = new AuthState();

  const login = () => {
    setIsLoading(true);
    Api.login(email, password)
      .then(({ access_token, id }) => {
        authState.setToken(access_token, id);
        history.push("/");
      })
      .catch(() => {
        toast.error("Login fehlgeschlagen");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Form onSubmit={login}>
      <Form.Input
        label="E-Mail"
        onChange={(event) => setEmail(event.target.value)}
        value={email}
      />
      <Form.Input
        label="Password"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        value={password}
      />
      <Form.Button type="submit" loading={isLoading}>
        Anmelden
      </Form.Button>
    </Form>
  );
}
