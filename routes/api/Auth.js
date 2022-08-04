import UserReg from "../../models/UserRegister.js";
import express from "express";
import bcrypt from "bcryptjs";
import jsonwt from "jsonwebtoken";
import * as constant from "../../setup/constants.js";
import passport from "passport";

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
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (hasherr, hash) {
              if (hasherr) throw hasherr;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  res.status(201).json({userCreated:"user has been registered"});
                })
                .catch((err) => console.log(err));
            });
          });
        } catch (error) {
          console.log(`${error}`);
        }
      }
    })
    .catch((error) => console.log(`Registration error: ${error}`));
});

// @type    POST
// @route    /api/auth/login
// @desc    route for login of registered users
// @access  PUBLIC

router.post("/login", (req, res) => {
  //  If the user email exists then compare the user with the password, if password matches then return string
  //"you can login successfully". If password don't match "Your credentials are incorrect".  If email doesn't exists
  // "Then your email doesn't exist".
  const password = req.body.password;
  const email = req.body.email;
  UserReg.findOne({email})
    .then((emailExists) => {
      if (emailExists) {
        bcrypt
          .compare(password, emailExists.password)
          .then((correctPassword) => {
            if (!correctPassword) {
              return res.status(401).json({ emailLoginMessage: "User login failure" });
            }

            const payload = {
              id: emailExists.id,
              name: emailExists.name,
              email: emailExists.email
            };

            jsonwt.sign(payload, constant.secret, { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: token
                });
              });

            // res
            //   .status(200)
            //   .json({ emailLoginMessage: "User logged in successfully" });

          })
          .catch((error) => {
            console.log(error);
          });
      } else{
        return res
        .status(404)
        .json({ emailRegistrationError: "Email doesn't exists" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

// @type    GET
//@route    /api/auth/profile
// @desc    route for user profile
// @access  PRIVATE

router.get("/profile", passport.authenticate("jwt", { session: false }),
(req, res) => {
      res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      });
});
