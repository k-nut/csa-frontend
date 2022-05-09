import "semantic-ui-css/semantic.min.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import List from "./pages/payment-status-list/List";
import Bets from "./pages/bets/Bets";
import ShareOverview from "./ShareOverview";
import { Menu } from "semantic-ui-react";
import Login from "./pages/login/Login";
import Members from "./pages/members/Members";
import MemberList from "./pages/member-list/MemberList";
import AuthState from "./services/AuthState";
import PasswordChange from "./pages/change-password/Password";

function loggedIn() {
  const authState = new AuthState();
  const token = authState.getToken();
  return !!token;
}

class SemanticNav extends React.Component {
  render() {
    return <NavLink {...this.props} exact className="item" />;
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      loggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class Logout extends React.Component {
  componentDidMount() {
    const authState = new AuthState();
    authState.clearToken();
    this.props.history.push("/");
  }

  render() {
    return <div>Logging out...</div>;
  }
}

const App = () => (
  <Router>
    <div>
      <Menu widths="4">
        <SemanticNav to="/">Übersicht</SemanticNav>
        <SemanticNav to="/bets">Gebote</SemanticNav>
        <SemanticNav to="/members">Mitglieder</SemanticNav>
        <SemanticNav to="/logout">Abmelden</SemanticNav>
      </Menu>

      <main>
        <Route exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={List} />
        <PrivateRoute exact path="/bets" component={Bets} />
        <PrivateRoute exact path="/members" component={Members} />
        <PrivateRoute exact path="/member-list" component={MemberList} />
        <PrivateRoute exact path="/share/:id" component={ShareOverview} />
        <PrivateRoute exact path="/logout" component={Logout} />
        <PrivateRoute exact path="/password" component={PasswordChange} />
      </main>
    </div>
  </Router>
);

export default App;
