import './App.css';
import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    NavLink
} from 'react-router-dom'
import List from "./List"
import Bets from "./Bets"
import ShareOverview from "./ShareOverview"
import { Menu } from 'semantic-ui-react'



class SemanticNav extends React.Component {
    render() {
        return <NavLink {...this.props} exact className="item"  />
    }
}

const App = () => (
    <Router>
        <div>
            <Menu widths="4">
                <SemanticNav to="/">Übersicht</SemanticNav>
                <SemanticNav to="/bets">Gebote</SemanticNav>
                <SemanticNav to="/upload">Upload</SemanticNav>
                <SemanticNav to="/logout">Abmelden</SemanticNav>
            </Menu>

            <main>
                <Route exact path="/" component={List} />
                <Route exact path="/bets" component={Bets} />
                <Route exact path="/share/:id" component={ShareOverview} />
            </main>
        </div>
    </Router>
)

export default App;
