import React, { useState } from "react";
import App from "./Components/App";
import Users from "./Components/Users";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Forgotpage from "./Components/Forgotpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

const Navigation = ({ user, signout }) => {
  const [menuIsActive, setMenuIsActive] = useState(false);
  return (
    <div className="navbar1">
      <Router>
        <div
          className="navigationBar"
          // style={{ backgroundColor: "transparent" }}
        >
          <div className="navBrand">
            <div className="navLogo">
              <img
                src="images/notetaker_logo.svg"
                alt="logo"
                className="mainLogo"
              />
            </div>
            <div
              className="navMobile"
              onClick={() => setMenuIsActive(!menuIsActive)}
            >
              <FontAwesomeIcon icon="bars" size="2x" fixedWidth />
            </div>
          </div>
          <div
            className="menuContainer"
            onClick={() => setMenuIsActive(!setMenuIsActive)}
          >
            <div
              className="navMenu"
              style={{ display: menuIsActive ? "block" : "" }}
            >
              <div className="navLink">
                <NavLink
                  to="/home"
                  exact
                  className="navLink"
                  activeClassName="selected"
                >
                  Home
                </NavLink>
              </div>

              {user ? (
                <>
                  <div className="navLink">
                    <NavLink
                      to="/noteapp"
                      className="navLink"
                      activeClassName="selected"
                    >
                      Note App
                    </NavLink>
                  </div>
                  <div className="navLink">
                    <NavLink
                      to="/users"
                      className="navLink"
                      activeClassName="selected"
                    >
                      Users
                    </NavLink>
                  </div>
                  <div className="navLink">
                    <a onClick={signout} className="navLink">
                      Sign Out
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="navLink">
                    <NavLink
                      to="/register"
                      className="navLink"
                      activeClassName="selected"
                    >
                      Register
                    </NavLink>
                  </div>
                  <div className="navLink">
                    <NavLink
                      to="/reset"
                      className="navLink"
                      activeClassName="selected"
                    >
                      Forgot Password
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
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
