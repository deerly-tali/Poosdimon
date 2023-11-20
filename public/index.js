// Import the functions we will use
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        onAuthStateChanged,
        signOut
} from "firebase/auth";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);//connecting our auth to our app

//elements needed for user signin
const email = document.getElementById('email');
const password = document.getElementById('password');
const loginButton = document.getElementById('loginButton');

//signing in the user
const userSignIn = async () => {
    const signInEmail = email.value;
    const signInPassword = password.value;

    signInWithEmailAndPassword(auth, signInEmail,signInPassword) //using Firebase Auth function
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        alert("Welcome Back!");
    })
    .catch ((error) => {
        const errCode = error.code;
        const errMessage = error.message;
        console.log(errCode + errMessage);
        alert(errMessage);
    });
}

const checkAuthState = async () => {

}

loginButton.addEventListener('click', userSignIn); //connecting frontend to backend