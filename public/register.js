import { app, auth} from './index';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const email = document.getElementById("email"); 
const password = document.getElementById("password");

const createUser = async (event) => {
    event.preventDefault();
    console.log("Creating user...");
    const signUpEmail = email.value;
    const signUpPassword = password.value;

    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {

    })
    .catch((error) => {
        console.log(error.code + error.message);
        alert(error.message);
    });

}