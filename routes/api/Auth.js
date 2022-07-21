import {newUserReg} from "../../models/UserRegister.js";
import express from "express";

export const router = express.Router();

router.post("/register", (req, res) => {
    newUserReg.findOne({email : req.body.email}).
     then(user => {if(user){
            res.status(404).json({emailRegistrationError:"Entered email already exists"})
     }else{
        const newUser = new newUserReg({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            userName: req.body.userName
        });

    try{
        newUser.insertOne();
    }
    catch(error){
        console.log(`${error}`);
    }
    }}).catch(error => console.log(`Registration error: ${error}`));

})

