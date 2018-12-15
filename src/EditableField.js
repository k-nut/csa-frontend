import React, { Component } from "react";
import { Button, Icon, Input } from "semantic-ui-react";

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
        <div>
          <Button icon onClick={this.save}>
            <Icon name="check" />
          </Button>
          <Input
            value={value}
            onChange={this.changeValue}
            onKeyUp={event => event.key === "Enter" && this.save()}
          />
        </div>
      );
    }
    return (
      <div>
        <Button icon onClick={this.toggleEdit}>
          <Icon name="edit" />
        </Button>
        {value}
      </div>
    );
  }
}

export default EditableField;
