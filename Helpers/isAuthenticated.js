import React from 'react';

export const isAuthenticated = () => firebase.auth().onAuthStateChanged(user => {
  if (user){
    console.log("user is authenticated")
  } else {
    console.log("user is not authenticated")
  }
})