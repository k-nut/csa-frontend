import React, {Component} from "react";
import * as Email from "./Email";
import Api from "../Api";
import {Button, Checkbox, Header} from "semantic-ui-react";

class SendEmail extends Component {
    sendDifference = () => {
        window.location.href = Email.getDifferenceText(this.props.share, this.props.deposits) + this.makeCC();
    };

    sendMissing = () => {
        window.location.href = Email.getMissingText(this.props.share) + this.makeCC();
    };


    makeCC = () => {
        const ccAddresses = this.state.users.filter(user => user.selected).map(user => user.email);
        return "&cc=" + ccAddresses.join(",");
    }

    selectUser = (toggleUser) => {
        this.setState({
            users: this.state.users.map(user => {
                user.selected = user === toggleUser ? !user.selected : user.selected;
                return user;
            })
        })
    }


    constructor() {
        super()
        this.state = {users: [{"email": "knut@k-nut.eu"}, {"email": "peter@example.com"}]}
    }

    componentDidMount() {
        Api.getUserEmails().then(response => this.setState({users: response.users}));
    }

    render() {
        if (!this.props.share.email) {
            return <div> Wenn du oben eine E-Mail Adresse hinzufügst kannst du hier vorformulierte E-Mails senden</div>
        }

        const userList = this.state.users.map(user => {
            return <Checkbox style={{display: "block"}}
                             label={user.email}
                             checked={user.selected}
                             onClick={() => this.selectUser(user)}/>;
        })

        return <div>
            <Header sub={true}> CC setzen </Header>
            {userList}
            <div style={{marginTop: "1em"}}>
                <Button content="Unstimmigkeit"
                        onClick={this.sendDifference}
                        icon="mail"/>

                <Button content="Fehlender Beitrag"
                        onClick={this.sendMissing}
                        icon="mail"/>
            </div>
        </div>
    }
}

export default SendEmail;
