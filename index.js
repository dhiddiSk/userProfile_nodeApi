import * as constant from "./setupSupport/constants.js";
import  express from "express";
import  mongoose from "mongoose";
import  {router} from "./routes/api/Auth.js";
import bodyParser from "body-parser";
import passport from "passport";

const applicationPortNumber = 3000;

const application = express();
application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());

const db = constant.mongoURL;

// Connect to the database
mongoose.connect(db).then(() => {
    console.log("The mongoDB has connected successfully");
}).catch(error => console.log(error));

application.use("/api/auth", router);
application.use(passport.initialize());
//require("./strategies/passportJwt")(passport);

// @type    GET
// @route    /
// @desc    Default route
// @access  PUBLIC
application.get("/", (req, res) => {
    res.send("Welcome to user registration application :)");
});

application.listen(applicationPortNumber, () => {
    console.log(`Application is listening on port ${applicationPortNumber}`);
});

