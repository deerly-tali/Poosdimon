import {auth} from './landing.js';
import {signOut} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signOutButton = document.getElementById('signOutButton');

const userSignOut = async () => {
    window.location.reload(); //auto triggers onDisconnect, removing user from database
    await signOut(auth); //signout user via Firebase Auth
}

signOutButton.addEventListener('click', userSignOut);