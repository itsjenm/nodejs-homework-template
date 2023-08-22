const { initializeApp } = require("firebase/app");
const { getAuth } = require('firebase/auth');
// using firestore 
const{ getFirestore } = require('firebase/firestore')
require('dotenv').config(); 

const firebaseConfig = {
  apiKey: process.env.FB_APIKEY,
  authDomain: "goit-node-hw4.firebaseapp.com",
  projectId: "goit-node-hw4",
  storageBucket: "goit-node-hw4.appspot.com",
  messagingSenderId: "605121161338",
  appId: process.env.FB_APPID,
  measurementId: "G-T5X102BCZ7",
};

const app = initializeApp(firebaseConfig);
// initialize auth for the app
const auth = getAuth(app);
const db = getFirestore(app);

module.exports = { auth, db }

