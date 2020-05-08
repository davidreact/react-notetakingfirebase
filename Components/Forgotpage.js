import React, {useState} from 'react';
import firebase from '../Services/firebase';

const Forgotpage = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");

const handlerPasswordReset = () => {

  firebase.auth().sendPasswordResetEmail(email).then(
  () => {
    setResult("Password Reset Email has been sent.")
  },
  err => {
    setResult("Opps sorry not a valid email")
  }
);

}



  return (
    <div>
    <h2>Reset your Password</h2>
      <input type="email" placeholder="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      />
      <button
        onClick={handlerPasswordReset}
      >Reset my Password</button>
      <br/>
      {result}
    </div>
  )
}

export default Forgotpage;