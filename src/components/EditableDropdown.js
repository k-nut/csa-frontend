import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import _ from "lodash";
import { PlainButton, ButtonHoverContainer } from "./PlainButton";

class EditableDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = { isEditing: false, value: this.props.value };
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

  changeValue(_, { value }) {
    this.setState({ value });
  }

  render() {
    const { shares } = this.props;
    const { isEditing, value } = this.state;

    if (!isEditing) {
      return (
        <ButtonHoverContainer>
          {_.find(shares, { value }).text}
          <PlainButton onClick={this.toggleEdit}>✏️</PlainButton>
        </ButtonHoverContainer>
      );
    }
    return (
      <div style={{ display: "flex" }}>
        <Dropdown
          selection
          search
          value={value}
          options={shares}
          onChange={this.changeValue}
        />
        <PlainButton onClick={this.save}>✅</PlainButton>
      </div>
    );
  }
}

export default EditableDropdown;
