import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyASsbl4v5TuO53XGt02qtWghn5FTVZpEE0",
    authDomain: "citylist-abf48.firebaseapp.com",
    databaseURL: "https://citylist-abf48.firebaseio.com",
    projectId: "citylist-abf48"
}
firebase.initializeApp(firebaseConfig)

// export const auth = fire.auth;
// export const db = firebase.firestore();
// export const firebase = fire;
export default firebase;