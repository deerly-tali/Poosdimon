const express = require("express"); //espress for backend
const app = express();
const PORT = process.env.PORT || 8080; //local port to test on, can change port if needed

const admin = require("firebase-admin"); //we will use firebase auth
const serviceAccount = require("./serviceKey.json"); //this is vital for firebase auth && PLS gitignore this

app.use(express.json()); //we will be handling json objs
app.use(express.urlencoded({extended: true})); //we will parse to our url ex: websitename.com/signup

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) //setting up for firebase admin auth
});


//signup a user
app.post('/signup', async (req, res) => { //make POST request with new user info
    console.log(req.body); //to debug

    try{
        const newUser = {
            email: req.body.email,
            password: req.body.password
        }

        const newUserResponse = await admin.auth().createUser({
            email: newUser.email,
            password: newUser.password,
            emailVerified: false,
            disabled: false
        })
        res.json(newUserResponse); //send json obj response

    }catch(error){
        console.log(error.message);
        res.status(409).send(error.message); //already existing account
    }
});


//login a user
app.post('/login', async (req,res) =>{ //POST request
    console.log(req.body); //to debug

    try{
        const userId = req.body.id;

    }catch(error){
        console.log(error.message);
        res.status(404).send(error.message);
    }
});


app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`); //to verify everything is running
});