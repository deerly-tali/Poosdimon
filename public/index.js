import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth,
        signInWithEmailAndPassword,
        onAuthStateChanged,
        signOut
    } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";


// our Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyAWNsQGx_Iw_y9e0N5zPqndiv6kk64SRiE",
    authDomain: "fir-demotest-105b0.firebaseapp.com",
    databaseURL: "https://fir-demotest-105b0-default-rtdb.firebaseio.com",
    projectId: "fir-demotest-105b0",
    storageBucket: "fir-demotest-105b0.appspot.com",
    messagingSenderId: "505860360257",
    appId: "1:505860360257:web:91b4277854be27e8501ec0",
    measurementId: "G-8GC3VQ6N0S"
  };  

// Initialize Firebase 
const app = initializeApp(firebaseConfig);//setting up our app
const auth = getAuth(app);//connecting our auth to our app

//elements needed for user signin
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const signOutButton = document.getElementById('signOutButton');

//signing in the user
const userSignIn = async (event) => {
    event.preventDefault();
    console.log("entering signIn function");
    const signInEmail = email.value;
    const signInPassword = password.value;

    signInWithEmailAndPassword(auth, signInEmail,signInPassword) //using Firebase Auth function
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        console.log("Welcome Baack!");
    })
    .catch ((error) => {
        const errCode = error.code;
        const errMessage = error.message;
        console.log(errCode + errMessage);
        alert(errMessage);
    });
}

const checkAuthState = async () => {
    onAuthStateChanged(auth, user => {
        if(user){ //if true then user exists && is signed in && are authenticated
            console.log("You're signed in!");
            //TODO: redirect to game
            //window.location.href("game.html");

        }else{
            console.log("You're not signed in!");
            //TODO: add some logic here
        }
    });
}

const userSignOut = async () => {
    await signOut(auth); //signout user via Firebase Auth
}

//TODO: add event prevent dafault
checkAuthState(); //let's check authstate
loginButton.addEventListener('click', userSignIn); //connecting frontend to backend
signOutButton.addEventListener('click', userSignOut);