import React, { FunctionComponent, useState } from "react";
import { Form } from "semantic-ui-react";

import Api from "../../services/Api";
import toast from "../../components/Toast";
import styled from "styled-components";
import { useLocation } from "react-router";
import axios from "axios";

const Container = styled.div`
  padding: 20px;
`;

const PasswordChange: FunctionComponent = () => {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);

  const changePassword = () => {
    Api.changePassword(password)
      .then(() => toast.success("Passwort geändert"))
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          // @ts-ignore
          const error = e.response?.data?.validation_error?.body_params?.[0];
          if (error.type === "value_error.any_str.min_length") {
            toast.error(`Das Passwort muss mindestens ${error?.ctx?.limit_value} Zeichen lang sein.
                   Bitte ändere es und probiere es erneut.`);
          } else {
            throw new Error("unknown backend error");
          }
        } else {
          toast.error("Ein Fehler ist aufgetreten");
        }
      });
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
