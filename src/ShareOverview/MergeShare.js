import React, { Component } from "react";
import Api from "../Api";
import { Button, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";

class MergeShare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sharesList: [],
      selectedShare: null
    };

    this.changShare = this.changShare.bind(this);
    this.mergeItems = this.mergeItems.bind(this);
  }

  componentDidMount() {
    Api.getShares().then(shares => {
      const sharesList = shares
        .filter(share => share.id !== this.props.originalShare)
        .map(share => {
          return {
            value: share.id,
            text: share.name
          };
        });
      this.setState({ sharesList });
    });
  }

  changShare(_, data) {
    this.setState({ selectedShare: data.value });
  }

  mergeItems() {
    Api.mergeShares(this.props.originalShare, this.state.selectedShare).then(
      () => {
        this.props.history.push("/");
      }
    );
  }

  render() {
    return (
      <div>
        <Dropdown
          selection
          search
          value={this.state.selectedShare}
          onChange={this.changShare}
          options={this.state.sharesList}
        />
        <Button
          onClick={this.mergeItems}
          disabled={!this.state.selectedShare}
          content="Zusammenführen"
        />
      </div>
    );
  }
}

MergeShare.propTypes = {
  originalShare: PropTypes.number,
  history: PropTypes.object
};

export default MergeShare;
