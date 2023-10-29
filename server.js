const express = require("express");
const app = express();

const admin = require("firebase-admin"); //we will use firebase auth
const serviceAccount = require("./serviceKey.json"); //this is gitIgnore bc very top secret

app.use(express.json());
app.use(express.urlencoded({extended: true}));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


//signup a user
app.post('/signup', async (req, res) => {
    console.log(req.body); //to debug
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    const userResponse = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
    });
    res.json(userResponse);
});


//local port to test on
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});