import  express from "express";
import  mongoose from "mongoose";
import  {router} from "./routes/api/Auth.js";
import bodyParser from "body-parser";
import passport from "passport";
import { passportStrategy } from "./strategies/passport.js";

const applicationPortNumber = 3000;
const application = express();
const db = "mongodb+srv://m001-student:m001-mongodb-basics@<sandbox.r05hnxv.mongodb.net/myFirstDatabase>";



application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());

// Connect to the database
mongoose.connect(db).then(() => {
    console.log("The mongoDB has connected successfully");
}).catch(error => console.log(error));

application.use(passport.initialize());
passportStrategy(passport);

//application.use(passport.initialize());

application.use("/api/auth", router);
// @type    GET
// @route    /
// @desc    Default route of application
// @access  PUBLIC
application.get("/", (req, res) => {
    res.send("Welcome to user registration application :)");
});

application.listen(applicationPortNumber, () => {
    console.log(`Application is listening on port ${applicationPortNumber}`);
});
