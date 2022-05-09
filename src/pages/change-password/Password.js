import React, { useState } from "react";
import { Form } from "semantic-ui-react";

import Api from "../../services/Api";
import toast from "../../components/Toast";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

export default function PasswordChange() {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const changePassword = () => {
    Api.changePassword(password)
      .then((response) => {
        if (response.ok) {
          toast.success("Passwort geändert");
        } else {
          throw response;
        }
      })
      .catch((error) => {
        error
          .json()
          .then((json) => {
            const error = json?.validation_error?.body_params?.[0];
            if (error.type === "value_error.any_str.min_length") {
              toast.error(`Das Passwort muss mindestens ${error?.ctx?.limit_value} Zeichen lang sein.
                   Bitte ändere es und probiere es erneut.`);
            } else {
              throw new Error("unknown backend error");
            }
          })
          .catch((e) => {
            toast.error("Ein Fehler ist aufgetreten");
          });
      });
  };

  const updateField = (setter) => (event) => setter(event.target.value);

  return (
    <Container>
      <p>
        Hier kannst du dein Passwort ändern. Das neue Passwort muss mindestens
        14 Zeichen lang sein.
      </p>
      <Form onSubmit={changePassword}>
        <Form.Input
          label="Neues Passwort"
          type="password"
          onChange={updateField(setPassword)}
          value={password}
        />
        <Form.Input
          label="Neues Passwort bestätigen"
          type="password"
          onChange={updateField(setPasswordRepeat)}
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
}
