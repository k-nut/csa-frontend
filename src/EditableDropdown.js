import React, {Component} from "react";
import {Button, Dropdown, Icon} from "semantic-ui-react";
import _ from "lodash";

class EditableDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {isEditing: false, value: this.props.value};
    this.toggleEdit = this.toggleEdit.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.save = this.save.bind(this);
  }

  toggleEdit() {
    this.setState({isEditing: true});
  }

  save() {
    const {value} = this.state;
    this.setState({isEditing: false});
    this.props.onSave(value);
  }

  changeValue(_, {value}) {
    this.setState({value});
  }

  render() {
    const {shares} = this.props;
    const {isEditing, value} = this.state;

    if (!isEditing) {
      return (
        <div>
          <Button icon onClick={this.toggleEdit}>
            <Icon name="edit"/>
          </Button>
          {_.find(shares, {value}).text}
        </div>
      );
    }
    return (
      <div>
        <Button icon onClick={this.save}>
          <Icon name="check"/>
        </Button>
        <Dropdown
          selection
          search
          value={value}
          options={shares}
          onChange={this.changeValue}
        />
      </div>
    );
  }
}

export default EditableDropdown;