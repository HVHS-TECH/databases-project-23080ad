/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase console. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/

const firebaseConfig = {
  apiKey: "AIzaSyAOhbMXzJp65SJ2-T2vWiRCN24wEZjZ4bE",
  authDomain: "angus-uggan-12-comp.firebaseapp.com",
  databaseURL: "https://angus-uggan-12-comp-default-rtdb.firebaseio.com",
  projectId: "angus-uggan-12-comp",
  storageBucket: "angus-uggan-12-comp.firebasestorage.app",
  messagingSenderId: "649037328381",
  appId: "1:649037328381:web:4b97f4b162b800c720f394"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// This log prints the firebase object to the console to show that it is working.
// As soon as you have the script working, delete this log.
console.log("Firebase initialize finished:");
console.log(firebase);