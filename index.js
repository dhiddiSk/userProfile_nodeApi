import User from "./models/UserRegister.js";
import * as constant from "./setupSupport/constants.js";
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const authorization = require("./routes/api/Auth");

const applicationPortNumber = 3000;

const application = express();

await mongoose.connect(constant.mongoURL).then(() => {
    console.log("The mongoDB has connected successfully");
}).catch(error => console.log(error));

application.use("/register", authorization);

application.get("/", (req, res) => {
    res.send("Welcome to user registration application :)");
});

application.post("/register", (req, res) => {
    
});

application.listen(applicationPortNumber, () => {
    console.log(`Application is listening on port ${applicationPortNumber}`);
});

