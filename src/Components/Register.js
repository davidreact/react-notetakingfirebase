import React, {useState} from "react";
import firebase from '../Services/firebase';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = e => {
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => console.log("signin Error", error));
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h2>Enter your Details below to Register</h2>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={e => signup(e)}>Sign up</button>
    </div>
  );
};

export default Register;
