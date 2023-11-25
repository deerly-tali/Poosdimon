import { auth} from './index.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signUpButton = document.getElementById("signUpButton");

const createUser = async (event) => {
    event.preventDefault();
    console.log("Creating user...");
    const signUpEmail = document.getElementById("email").value;
    const signUpPassword = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
        console.log("Welcome to Poosdimon");
        window.location.href="game.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
        alert(errorMessage);
    });
}

signUpButton.addEventListener('click', createUser);