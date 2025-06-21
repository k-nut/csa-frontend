import React, { FunctionComponent, useState } from "react";
import { Form } from "semantic-ui-react";

import Api from "../../services/Api";
import toast from "../../components/Toast";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router";
import authState from "../../services/AuthState";

const Container = styled.div`
  padding: 20px;
`;

const PasswordChange: FunctionComponent = () => {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const { search } = useLocation();
  const history = useHistory();
  const urlParams = new URLSearchParams(search);

  const changePassword = async () => {
    const response = await Api.changePassword(password);
    if (!response.ok) {
      const { error } = response;
      toast.error(`Das Passwort muss mindestens ${error.value} Zeichen lang sein.
                   Bitte ändere es und probiere es erneut.`);
    } else {
      toast.success("Passwort geändert");
      if (urlParams.has("mustChange")) {
        authState.needsPasswordChange = false;
        history.push("/");
      }
    }
  };

  const mustChangeMessage =
    "Du musst dein Passwort ändern, bevor du fortfahren kannst.";
  const defaultMessage = "Hier kannst du dein Passwort ändern.";

  return (
    <Container>
      <p>
        {urlParams.has("mustChange") ? mustChangeMessage : defaultMessage}
        Das neue Passwort muss mindestens 14 Zeichen lang sein.
      </p>
      <p></p>
      <Form onSubmit={changePassword}>
        <Form.Input
          label="Neues Passwort"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Form.Input
          label="Neues Passwort bestätigen"
          type="password"
          onChange={(e) => setPasswordRepeat(e.target.value)}
          value={passwordRepeat}
        />
        <Form.Button
          type="submit"
          disabled={!password || password !== passwordRepeat}
        >
          Passwort aktualisieren
        </Form.Button>
      </Form>
    </Container>
  );
};

export default PasswordChange;
