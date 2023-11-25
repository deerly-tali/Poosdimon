import {auth} from './index.js';
import {signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signOutButton = document.getElementById('signOutButton');

const userSignOut = async () => {
    await signOut(auth); //signout user via Firebase Auth

    onAuthStateChanged (auth, user => {
        if(!user){
            console.log("Goodbye!");
            window.location.href="index.html";
        }
    });
}


signOutButton.addEventListener('click', userSignOut);