import {auth} from './index';
import {signOut} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signOutButton = document.getElementById('signOutButton');

const userSignOut = async () => {
    await signOut(auth); //signout user via Firebase Auth
}

signOutButton.addEventListener('click', userSignOut);