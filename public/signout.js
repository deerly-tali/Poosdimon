import {app, auth} from './index.js';
//import { database } from './app.js';
import {signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
//import {ref, remove} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

const signOutButton = document.getElementById('signOutButton');

const userSignOut = async () => {
    await signOut(auth); //signout user via Firebase Auth

    onAuthStateChanged (auth, user => { //check auth state
        if(!user){ //once user is signed out, redirect them to the index page
            window.location.href="index.html";
            console.log("Goodbye!");
        }
    });
}

signOutButton.addEventListener('click', userSignOut);