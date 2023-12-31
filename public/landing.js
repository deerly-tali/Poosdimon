import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth,
        signInAnonymously,
        signInWithEmailAndPassword,
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
const loginButton = document.getElementById('loginButton');
const anonButton = document.getElementById('anonLoginButton');

//signing in the user
const userSignIn = async (event) => {
    event.preventDefault();
    console.log("Logging in...");
    const signInEmail = document.getElementById('email').value;
    const signInPassword =document.getElementById('password').value;

    signInWithEmailAndPassword(auth, signInEmail,signInPassword) //using Firebase Auth function
    .then((userCredential) => {
        const user = userCredential.user;
        console.log("Welcome Baack!");
        window.location.href="game.html";
    })
    .catch ((error) => {
        const errCode = error.code;
        const errMessage = error.message;
        console.log(errCode + errMessage);
        alert(errMessage + "Please Try Again!");
    });
}

const anonSignIn = async (event) => {
    event.preventDefault();
    signInAnonymously(auth)
    .then(() => {
        console.log("Anon Mode");
        window.location.href = "game.html";
    })
    .catch((error) => {
        console.log(error.code + error.message);
        alert(error.message);
    });
}

if (loginButton){
    loginButton.addEventListener('click', userSignIn); //connecting frontend to backend
}

if(anonButton){
    anonButton.addEventListener('click', anonSignIn);
}

export {app, auth};