import UserReg from "../../models/UserRegister.js";
import express from "express";
import bcrypt from "bcryptjs";

export const router = express.Router();

// @type    POST
// @route    /api/auth/register
// @desc    route for registration of users
// @access  PUBLIC

router.post("/register", (req, res) => {
  UserReg.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res
          .status(404)
          .json({ emailRegistrationError: "Entered email already exists" });
      } else {
        const newUser = new UserReg({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          userName: req.body.userName,
        });

        try {

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(hasherr, hash) {
                    if (hasherr) throw hasherr;
                    newUser.password = hash;
                });
            });

          newUser
            .save()
            .then((user) => {
              res.json(user);
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.log(`${error}`);
        }
      }
    })
    .catch((error) => console.log(`Registration error: ${error}`));
});
