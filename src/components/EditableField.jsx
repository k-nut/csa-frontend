import React, { Component } from "react";
import styled from "styled-components";
import { Input } from "semantic-ui-react";
import { PlainButton, ButtonHoverContainer } from "./PlainButton";

const InputContainer = styled.div`
  display: flex;
`;

class EditableField extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, value: props.value };

    this.toggleEdit = this.toggleEdit.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.save = this.save.bind(this);
  }

  toggleEdit() {
    this.setState({ isEditing: true });
  }

  save() {
    const { value } = this.state;
    this.setState({ isEditing: false });
    this.props.onSave(value);
  }

  changeValue(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    const { value, isEditing } = this.state;
    if (isEditing) {
      return (
        <InputContainer>
          <Input
            value={value}
            onChange={this.changeValue}
            onKeyUp={(event) => event.key === "Enter" && this.save()}
          />
          <PlainButton onClick={this.save}>
            <span role="img" aria-label="bestätigen">
              ✅
            </span>
          </PlainButton>
        </InputContainer>
      );
    }
    return (
      <ButtonHoverContainer>
        {value}
        <PlainButton onClick={this.toggleEdit}>
          <span role="img" aria-label="speichern">
            ✏️
          </span>
        </PlainButton>
      </ButtonHoverContainer>
    );
  }
}

export default EditableField;
