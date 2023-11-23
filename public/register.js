import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

// Check that passwords match
var password = document.getElementById("password"), 
confirm_password = document.getElementById("confirm_password");

function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
    window.location.replace("index.html");
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;