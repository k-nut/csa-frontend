import React, {Component} from 'react';
import _ from "lodash";
import moment from "moment";
import {Link} from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.css"

import {Input, Table, Dropdown, Loader} from "semantic-ui-react";
import Api from "./Api"
import { filterNameAndStation } from "./Utils";



class Bets extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shares: [],
            nameFilter: "",
            stations: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.changeProperty = this.changeProperty.bind(this);
    }

    handleChange(event) {
        this.setState({nameFilter: event.target.value});
    }

    componentDidMount() {
        function keyById(stations){
            return _.reduce(stations, (acc, station) => {
                acc[station.id] = station.name;
                return acc;
            }, {});
        }

        Promise.all([Api.getShares(), Api.getStations()]).then(([shares, stations]) => {
            const keyedStations = keyById(stations);
            
            const newShares = shares.map(share => {
                share.station_name = keyedStations[share.station_id];
                return share
            });

            this.setState({
                shares: newShares,
                stations: stations,
            })
        });
    }


    changeProperty(share, property, value) {
        share[property] = value;
        return Api.updateShare(share).then(updatedShare => {
            const newShares = _.cloneDeep(this.state.shares);
            const index  = _.findIndex(newShares, share);
            newShares[index] = updatedShare;
            this.setState({shares: newShares});
            toastr.success(`${share.name} aktualisiert!`,  '', {timeOut: 500})
        })
    }

    render() {
        const shares = _.chain(this.state.shares)
            .filter(filterNameAndStation(this.state.nameFilter))
            .sortBy(["station_id", "name"])
            .map(share => {
                return <Bet share={share}
                            stations={this.state.stations}
                            changeProperty={this.changeProperty}
                            key={share.name}/>
            })
            .value();
        return (
            <div>
                <Input value={this.state.nameFilter} onChange={this.handleChange} placeholder="Filter..."/>
                <Table celled  className="stickytable">
                    <Table.Header >
                        <Table.Row>
                            <Table.HeaderCell> Name </Table.HeaderCell>
                            <Table.HeaderCell> Notiz </Table.HeaderCell>
                            <Table.HeaderCell> Abholstelle </Table.HeaderCell>
                            <Table.HeaderCell> Gebot </Table.HeaderCell>
                            <Table.HeaderCell> Startmonat </Table.HeaderCell>
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

function Bet(props) {
    const months = _.range(12).map(i => {
        const date = moment().startOf("year").add(i, 'months');
        return {text: date.format("MMMM"), value: date.format()}
    });

    const changeMonth = (e, v) => {
        props.changeProperty(props.share, "start_date", v.value)
    };

    const changeBet = _.debounce((_, v) => { props.changeProperty(props.share, "bet_value", v.value)}, 500);

    const changeNote = _.debounce((_, v) => { props.changeProperty(props.share, "note", v.value)}, 500);


    const changeStation = (_, values) => {
        props.changeProperty(props.share, "station_id", values.value)
    };

    const stations = props.stations.map(station => {
        station.value = station.id;
        station.text = station.name;
        return station
    });

    return (
        <Table.Row>
            <Table.Cell>
                <Link to={`/share/${props.share.id}`}>
                    {props.share.name}
                </Link>
            </Table.Cell>
            <Table.Cell>
                <Input defaultValue={props.share.note} onChange={changeNote} />
            </Table.Cell>
            <Table.Cell>
                <Dropdown selection
                          defaultValue={props.share.station_id}
                          options={stations}
                          onChange={changeStation}/>
            </Table.Cell>
            <Table.Cell>
                <Input defaultValue={props.share.bet_value}
                       onChange={changeBet}/></Table.Cell>
            <Table.Cell>
                <Dropdown selection
                          defaultValue={moment(props.share.start_date).format()}
                          options={months}
                          onChange={changeMonth}/>
            </Table.Cell>
        </Table.Row>
    );
}

export default Bets;
