import React from "react";
import Login from "./Login";

const Text = () => (
  <div>
    <ul>
      <div>Application integrations:</div>
      <li>Integration with Firebase Authentication</li>
      <li>
        React Router implementation with Redirects depending if authenticated
      </li>
      <li>Integration with Firestore</li>
      <li>
        Configuration of firestore rules to limit notes to only user created
      </li>
      <li>Cache sort order even after refreshing using LocalStorage</li>
      <li>Ability to edit, create, delete, and update an existing item</li>
    </ul>
    <br />
    <div>
      <ul>
        {" "}
        Further integrations:
        <li>
          Move fetch logic to Parent app to avoid calling data everytime user
          clicks on appnote
        </li>
        <li />
        <li />
        <li />
        <li />
      </ul>
    </div>
  </div>
);

const Home = ({ user }) => {
  return (
    <div>
      <div className="title is-4 has-text-white">
        Welcome to Note Taking App
      </div>
      {user ? <Text /> : <Login />}
    </div>
  );
};

export default Home;
