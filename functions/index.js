/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const express = require("express"); // espress for backend
const axios = require("axios");

const app = express();
const admin = require("firebase-admin"); // we will use firebase auth
const serviceAccount = require("./serviceKey.json");


app.use(express.json()); // we will be handling json objs
app.use(express.urlencoded({extended: true})); // we will parse to our url
// app.use(express.static('public'));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


app.get("/hello", (req, res) =>{
  res.send("hello worlds");
});


// get a pokemon from poke api
app.get("/pokemon/:name", async (req, res) =>{
  try {
    const {name} = req.params;
    const response = axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((pokemon) => {
          console.log(pokemon.data);
          const data = pokemon.data;
          res.send(data);
        })
        .catch((error) =>{
          console.log(error);
        });
    console.log(response);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// signup a user
app.post("/signup", async (req, res) => {
  try {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
    };

    const newUserResponse = await admin.auth().createUser({
      email: newUser.email,
      password: newUser.password,
      emailVerified: true,
      disabled: false,
    });
    res.json(newUserResponse);
  } catch (error) {
    console.log(error.message);
    res.status(409).send(error.message); // already existing account
  }
});

exports.app = functions.https.onRequest(app);
