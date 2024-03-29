import React, { useState } from "react";
import { Form } from "semantic-ui-react";

import Api from "../../services/Api";
import toast from "../../components/Toast";
import authState from "../../services/AuthState";
import styled from "styled-components";

const Container = styled.div`
  padding: 10px;
`;

const LoginForm = styled(Form)`
  max-width: 60ch !important;
`;

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = () => {
    setIsLoading(true);
    Api.login(email, password)
      .then(({ access_token, id }) => {
        authState.setToken(access_token, id);
        history.push("/");
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Login fehlgeschlagen");
      });
  };

  return (
    <Container>
      <LoginForm onSubmit={login}>
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
      </LoginForm>
    </Container>
  );
}
