import * as constant from "./setupSupport/constants.js";
import  express from "express";
import  mongoose from "mongoose";
import  {router} from "./routes/api/Auth.js";

const applicationPortNumber = 3000;

const application = express();

await mongoose.connect(constant.mongoURL).then(() => {
    console.log("The mongoDB has connected successfully");
}).catch(error => console.log(error));

application.use("/api/auth", router);

application.get("/", (req, res) => {
    res.send("Welcome to user registration application :)");
});

// application.post("/register", (req, res) => {
    
// });

application.listen(applicationPortNumber, () => {
    console.log(`Application is listening on port ${applicationPortNumber}`);
});

