import UserRegister from "./models/UserRegister.js";
const express = require("express");
const router = express.Router();


router.post("/register", (req, res) => {
     UserRegister.findOne({email : req.body.email}).
     then(user => {if(user){
            res.status(404).json({emailRegistrationError:"Entered email already exists"})
     }else{

        const newUser = new UserRegister({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            userName: req.body.userName
        });

       newUser.save();
     }}).catch( error => console.log(`Registration error: ${error}`));

})
