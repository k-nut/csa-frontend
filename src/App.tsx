import "semantic-ui-css/semantic.min.css";
import React, { FunctionComponent, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  NavLinkProps,
  RouteProps,
} from "react-router-dom";
import List from "./pages/payment-status-list/List";
import Bets from "./pages/bets/Bets";
import ShareOverview from "./ShareOverview";
import { Menu } from "semantic-ui-react";
import Login from "./pages/login/Login";
import Members from "./pages/members/Members";
import MemberList from "./pages/member-list/MemberList";
import PasswordChange from "./pages/change-password/Password";
import authState from "./services/AuthState";
import { Switch, useHistory, useLocation } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter5Adapter } from "use-query-params/adapters/react-router-5";

const SemanticNav: FunctionComponent<NavLinkProps> = (props) => (
  <NavLink {...props} exact className="item" />
);

enum Routes {
  root = "/",
  login = "/login",
  logout = "/logout",
  password = "/password",
}

const PrivateRoute: FunctionComponent<RouteProps> = (props) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const maybeRedirect = () => {
    if (authState.loading) {
      return false;
    }
    if (!authState.isLoggedIn && pathname !== Routes.login) {
      history.push(Routes.login);
      return true;
    }
    if (authState.needsPasswordChange && pathname !== Routes.password) {
      history.push(`${Routes.password}?mustChange=true`);
      return true;
    }
    return false;
  };

  authState.onChange = maybeRedirect;

  return (maybeRedirect() && <></>) || <Route {...props} />;
};

const Logout: FunctionComponent = () => {
  const history = useHistory();
  useEffect(() => {
    authState.clearToken();
    history.push(Routes.root);
  });

  return <div>Logging out...</div>;
};

const queryClient = new QueryClient();

const App: FunctionComponent = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <QueryParamProvider adapter={ReactRouter5Adapter}>
        <div>
          <Menu widths="4">
            <SemanticNav to="/">Übersicht</SemanticNav>
            <SemanticNav to="/bets">Gebote</SemanticNav>
            <SemanticNav to="/members">Mitglieder</SemanticNav>
            <SemanticNav to="/logout">Abmelden</SemanticNav>
          </Menu>

          <main>
            <Switch>
              <Route exact path={Routes.login} component={Login} />
              <Route exact path={Routes.logout} component={Logout} />

              <PrivateRoute exact path={Routes.root} component={List} />
              <PrivateRoute exact path="/bets" component={Bets} />
              <PrivateRoute exact path="/members" component={Members} />
              <PrivateRoute exact path="/member-list" component={MemberList} />
              <PrivateRoute exact path="/share/:id" component={ShareOverview} />
              <PrivateRoute
                exact
                path={Routes.password}
                component={PasswordChange}
              />
            </Switch>
          </main>
        </div>
      </QueryParamProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </Router>
  </QueryClientProvider>
);

export default App;
