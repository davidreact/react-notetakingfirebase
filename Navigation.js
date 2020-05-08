import React from "react";
import App from "./Components/App";
import Users from "./Components/Users";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Forgotpage from "./Components/Forgotpage";
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

const Navigation = ({ user, signout }) => {
  return (
    <div className="navbar1">
      <Router>
        <nav>
          <div className="navLogo">NoteApp</div>
          <NavLink
            to="/home"
            exact
            className="navLink"
            activeClassName="selected"
          >
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/noteapp"
                className="navLink"
                activeClassName="selected"
              >
                Note App
              </NavLink>
              <NavLink
                to="/users"
                className="navLink"
                activeClassName="selected"
              >
                Users
              </NavLink>
              <a onClick={signout} className="navLink">
                Sign Out
              </a>
            </>
          ) : (
            <>
              <NavLink
                to="/register"
                className="navLink"
                activeClassName="selected"
              >
                Register
              </NavLink>
              <NavLink
                to="/reset"
                className="navLink"
                activeClassName="selected"
              >
                Forgot Password
              </NavLink>
            </>
          )}
        </nav>
        <div className="appContainer">
          <Switch>
            <Route path="/noteapp">
              {user ? <App user={user} /> : <Redirect to="/" />}
            </Route>
            <Route path="/users">
              {user ? <Users user={user} /> : <Redirect to="/" />}
            </Route>
            <Route path="/register">
              {user ? <Redirect to="/noteapp" /> : <Register />}
            </Route>
            <Route path="/reset">
              {user ? <Redirect to="/noteapp" /> : <Forgotpage />}
            </Route>
            <Route path="/home">
              <Home user={user} />
            </Route>
            <Route path="/">
              {user ? <Redirect to="/noteapp" /> : <Home user={user} />}
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default Navigation;
