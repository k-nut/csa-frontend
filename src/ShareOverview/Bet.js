import React, {Component} from "react";
import {debounce, range} from "lodash";
import moment from "moment";
import {Dropdown, Input} from "semantic-ui-react";

class Bet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date: props.bet.start_date,
            end_date: props.bet.end_date,
            value: props.bet.value,
            id: props.bet.id,
        }
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.changeValue = this.changeValue.bind(this);
    }


    changeStart(_, data) {
        this.setState({start_date: data.value}, this.update)
    }

    update = debounce(() => {
        this.props.updateCallback(this.state);
    }, 500);

    changeEnd(_, data) {
        this.setState({end_date: data.value}, this.update)
    }

    changeValue(event) {
        this.setState({value: event.target.value}, this.update)
    }

    render() {
        const months = range(24).map(i => {
            const date = moment("2017-01-01").startOf("year").add(i, 'months');
            return {text: date.format("MMMM YYYY"), value: date.format()}
        });

        const endMonths = range(24).map(i => {
            const date = moment("2017-01-01").startOf("year").add(i, 'months').endOf("month").startOf("day");
            return {text: date.format("MMMM YYYY"), value: date.format()}
        });

        endMonths.push({text: "--", value: null})

        const {start_date, end_date, value} = this.state;

        return (
            <div>
                <label> Start:
                    <Dropdown selection
                              name="start_date"
                              defaultValue={moment(start_date).format()}
                              onChange={this.changeStart}
                              options={months}
                    />
                </label>
                <label> Ende:
                    <Dropdown selection
                              defaultValue={moment(end_date).format()}
                              onChange={this.changeEnd}
                              options={endMonths}
                    />
                </label>
                <label> Betrag:
                    <Input type="number" value={value} onChange={this.changeValue}/>
                </label>
                {this.props.bet.id &&
                <button onClick={() => this.props.deleteCallback(this.props.bet.id)}> Löschen </button>}
            </div>
        )
    }

}

export default Bet;