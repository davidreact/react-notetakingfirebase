import React, { useState, useEffect } from "react";
import firebase from "../Services/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlerSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error);
        setError(error);
      });
  };

  return (
    <div>
      {!error ? (
        ""
      ) : (
        <div className="notification is-danger is-light">
          User and Password not valid, please check the details and try again
        </div>
      )}

      <form
        className="field is-horizontal"
        onKeyDown={e => {
          if (e.keyCode == 13) {
            handlerSignIn();
          }
        }}
      >
        <div className="field-body">
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="username"
                placeholder="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon="user" />
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control is-expanded has-icons-left has-icons-right">
              <input
                className="input"
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon="envelope" />
                <i className="fas fa-envelope" />
              </span>
            </p>
          </div>
        </div>
      </form>
      <p className="control">
        <a className="button is-info" onClick={handlerSignIn}>
          Sign In
        </a>
      </p>
    </div>
  );
};

export default Login;
