import UserReg from "../../models/UserRegister.js";
import express from "express";

export const router = express.Router();

router.post("/register", (req, res) => {
    UserReg.findOne({email : req.body.email})
     .then(user => {if(user){
            res.status(404).json({emailRegistrationError:"Entered email already exists"})
     }else{
        const newUser = new UserReg({
            namme: req.body.namme,
            emaml: req.body.emaml,
            password: req.body.password,
            userName: req.body.userName
        });

    try{
        console.log("The code execution has entered try block");
        console.log(`This is the name sent via postman ${req.body.namme}`);
        newUser.save()
            .then(user => {
                console.log("The code execution entered the save method");
                res.json(user)})
            .catch(err => console.log(err));
    }
    catch(error){
        console.log(`${error}`);
    }
    }}).catch(error => console.log(`Registration error: ${error}`));

})

