import { Button } from "semantic-ui-react";
import Dropzone from "react-dropzone";
import React, { Component } from "react";
import Api from "./Api";

export default class Upload extends Component {
  constructor() {
    super();
    this.state = { files: [] };

    this.uploadFile = this.uploadFile.bind(this);
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  uploadFile() {
    Api.uploadFile(this.state.files[0]).then(res => {
      this.props.history.push("/");
    });
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>CSV-Datei hier fallen lassen oder klicken zum Hinzufügen</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Datei:</h2>
          <ul>
            {this.state.files.map(f => (
              <li>
                {f.name} - {f.size} bytes
              </li>
            ))}
          </ul>
        </aside>
        <Button
          disabled={!this.state.files.length}
          content="Hochladen"
          onClick={this.uploadFile}
        />
      </section>
    );
  }
}
