import React, {Component} from 'react';
import _ from "lodash";
import {Table, Input, Checkbox, Loader} from "semantic-ui-react";
import Api from "./Api";
import { Link } from "react-router-dom"
import * as queryString from "query-string";

function Share(props) {
    const state = props.share.difference_today < 0 ? "negative" : "positive";
    return (
        <Table.Row className="share">
            <Table.Cell>
                <Link to={`/share/${props.share.id}`}>
                    {props.share.name}
                </Link>
            </Table.Cell>
            <Table.Cell> {props.share.station_name} </Table.Cell>
            <Table.Cell> {props.share.number_of_deposits} </Table.Cell>
            <Table.Cell> {props.share.expected_today} </Table.Cell>
            <Table.Cell> {props.share.total_deposits} </Table.Cell>
            <Table.Cell className={state}> {props.share.difference_today} </Table.Cell>
        </Table.Row>
    )
}


class List extends Component {
    constructor(props) {
        super(props);
        const params = queryString.parse(props.location.search);
        this.state = {
            shares: [],
            nameFilter: params.nameFilter,
            filterProblems: params.filterProblems,
            showArchived: params.showArchived,
        };

        this.handleChange = this.handleChange.bind(this);
        this.setFilterProblems = this.setFilterProblems.bind(this);
        this.showArchived = this.showArchived.bind(this);
        this.syncState = this.syncState.bind(this);
    }

    syncState() {
        const currentState = queryString.parse(this.props.location.search);
        currentState.nameFilter = this.state.nameFilter;
        if (this.state.filterProblems) {
            currentState.filterProblems = this.state.filterProblems;
        } else {
            delete currentState.filterProblems;
        }
        if (this.state.showArchived) {
            currentState.showArchived = this.state.showArchived;
        } else {
            delete currentState.showArchived;
        }
        this.props.history.replace({search:`${queryString.stringify(currentState)}`});
    }

    handleChange(event) {
        this.setState({nameFilter: event.target.value}, this.syncState);
    }

    setFilterProblems(event, data) {
        this.setState({filterProblems: data.checked}, this.syncState)
    }

    showArchived(event, data) {
        this.setState({showArchived: data.checked}, this.syncState)
    }

    componentDidMount() {
        Api.getSharesPayments().then(shares => {
            this.setState({shares})
        });
    }

    render() {
        const shares = _.chain(this.state.shares)
            .filter(share => {
                if (!this.state.nameFilter) { return true }
                if (!share.name || !share.station_name){ return false }
                const term = this.state.nameFilter.toLowerCase();
                const nameMatches = _.includes(share.name.toLowerCase(), term);
                const stationMatches = _.includes(share.station_name.toLowerCase(), term);
                return nameMatches || stationMatches;
            })
            .filter(share => {
                if (this.state.filterProblems){
                    return share.difference_today < 0;
                }
                return true;
            })
            .filter(share => {
                if (!this.state.showArchived){
                    return !share.archived;
                }
                return true;
            })
            .sortBy(["station_name", "name"])
            .map(share => {
                return <Share share={share} key={share.name}/>
            })
            .value();
        return (
            <div>
                <div className="spaced">
                    <Input value={this.state.nameFilter} onChange={this.handleChange} placeholder="Filter..."/>
                    <Checkbox checked={this.state.filterProblems} onChange={this.setFilterProblems} label="Nur Fehlbeträge zeigen" />
                    <Checkbox checked={this.state.showArchived} onChange={this.showArchived} label="Archivierte anzeigen" />
                </div>
                <Table celled>
                    <Table.Header className="stickytable">
                        <Table.Row>
                            <Table.HeaderCell> Namen </Table.HeaderCell>
                            <Table.HeaderCell> Abholstelle </Table.HeaderCell>
                            <Table.HeaderCell> Zahlungen </Table.HeaderCell>
                            <Table.HeaderCell> Erwartet </Table.HeaderCell>
                            <Table.HeaderCell> Kontostand </Table.HeaderCell>
                            <Table.HeaderCell> Differenz </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {this.state.shares.length ?
                        <Table.Body>
                            {shares}
                        </Table.Body> :
                            <Loader active inline='centered'/>
                    }
                </Table>
            </div>
        );
    }
}


export default List;
