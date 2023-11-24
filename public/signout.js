import {auth} from './index';
import {signOut, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const signOutButton = document.getElementById('signOutButton');

const userSignOut = async () => {
    await signOut(auth); //signout user via Firebase Auth
}

const checkSignOut = async () => {
    onAuthStateChanged(auth, user => {
        if(!user){ //if true then user exists && is signed in && are authenticated
            console.log("You're signed in!");
            window.location.href="index.html";

        }else{
            console.log("You're Still Signed In!");
        }
    });
}

checkSignOut();
signOutButton.addEventListener('click', userSignOut);