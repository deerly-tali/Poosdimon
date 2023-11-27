import { auth} from './index.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signUpButton = document.getElementById("signUpButton");

const createUser = async (event) => {
    event.preventDefault();
    console.log("Creating user...");
    const signUpEmail = document.getElementById("email").value;
    const signUpPassword = document.getElementById("password");
    const confirmedPassword = document.getElementById("confirmedPassword");

    if(signUpPassword.value == confirmedPassword.value){
        const password = signUpPassword.value;

        createUserWithEmailAndPassword(auth, signUpEmail, password)
        .then((userCredential) => {
            window.location.href="game.html";
            console.log("Welcome to Poosdimon");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode + errorMessage);
            alert(errorMessage);
        });
    }else{
        alert("Passwords Don't Match, Try Again");
    }
}

signUpButton.addEventListener('click', createUser);