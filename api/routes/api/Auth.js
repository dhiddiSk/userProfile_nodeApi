import UserRegSchema from "../../models/UserRegisterSchema.js";
import express from "express";
import bcrypt from "bcryptjs";
import jsonwt from "jsonwebtoken";
import { secret } from "../../setup/constants.js";
import passport from "passport";

export const router = express.Router();

// This function should be a service.
// Something `services/auth.js` and export functions from this service
const jwtTokenGeneration = function (payload) {
  // You can return directly the result of `sign` since you won't be doing
  // anything with `token` function
  return jsonwt.sign(payload, secret, { expiresIn: 3600 });
};

// 1. The name of the function doesn't tell me what exactly this does.
//    I have to read what's inside of the function for me to understand what it does.
// 2. This function should be in a service. Think of a service as a piece of code that you can
//    reuse in any other place, therefore it needs to be descriptive enough.
//    From what I understand this means that you want to create a user and generate a JWT token.
//    You can call this function `registerUser`
// 3. This function is breaking the principle of `single responsibility` of SOLID's approach
//    (see https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english)
//    I would break this into two functions:
//      1. createUser
//      2. createJwtTokenForUser
const registration = async function (req, res) {
  const newUser = new UserRegSchema({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userName: req.body.userName,
  });
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(newUser.password, salt);
  newUser.password = hashpassword;
  const userSignup = await newUser.save();

  // No need to store this as a variable.
  // Only store things in variables if you are going to re-use them in other places.
  // You are only using this in a single place, therefore just pass the object directly to it.
  const jwtToken = await jwtTokenGeneration({
    id: userSignup.id,
    name: userSignup.name,
    email: userSignup.email,
  });

  res.status(200).json({
    success: true,
    token: jwtToken,
  });
};

// Over here I will talk a bit more about the function that you wrote on the top and most likely will do a new one.
// Imagine that you create a new service called `Auth.js` and this service exports a function called `registerUser`.
// Me, as a developer that will call this function I want this to be as simple as possible.
// In your function above you are telling that when I call `registration` function I need to pass
// a `request` and a `response` that comes from `express`.
// Now, imagine the following feature request:
// User can invite another user. As soon as this user invite another user, we register this user in our system.
// There are a couple of problems here:
//    1. You might call this function from another part of your application that doesn't have `request` and `response` available to you from express
//    2. Inside the function above you are doing `res.status(200)` which is doing two things inside the same function. Again, breaking single responsibility principle
// Now, lets do a high overview on how you could break the function above to be more re-usable
const saltPassword = async function (password) {
  return await bcrypt.genSalt(10);
}

const createUser = async function(user) {
  const newUser = new UserRegSchema({
    name: user.name,
    email: user.email,
    password: user.password,
    userName: user.userName,
  });

  newUser.password = await bcrypt.hash(newUser.password, saltPassword(user.password));

  return await newUser.save();
}

const registerUser = async function (user) {
  const createdUser = createUser(user);

  const jwtToken = await jwtTokenGeneration({
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
  });

  return {
    jwtToken,
    createdUser,
  }
}

const userExist = async function (email) {
  // Not sure if it returns undefined or not here. Please, check
  return (await UserRegSchema.findOne({ email })) !== undefined;
}

// Notice how we moved the logic to create a user to a much simpler way where we only need
// to pass what the function needs - the user details and not the entire response from express.
// This allows the `registerUser` function to be called from many other places and not only from an
// express route
router.post('/register', async (request, response) => {
  // @TODO: We still need to validate the request here. Will leave this one up to you

  if (await userExist(request.body.email)) {
    // The number 401 is an http code that is a constant. Therefore you should use constants.
    // Either you can define them yourself e.g. const HTTP_CODES = { OK: 200, ... }
    // or you can use some packages that already have that: https://www.npmjs.com/package/http-status-codes
    response.status(401).json({ error: 'User already exist' });
  }

  try {
    const data = await registerUser(request.body);

    // No need to pass "error: false" because the http code already tells
    // that the response is okay - 201 means "Server responded good and a resource was created"
    response.status(201).json({ token: data.jwtToken });
  } catch (e) {
    // No need to pass "error: true" because the http code already tells
    // that the response is okay - 500 means "Server error"
    response.status(500).json({ error: 'Error trying to create user' });
  }
});

// @type    POST
// @route   /api/auth/register
// @desc    route for registration of users
// @access  PUBLIC

router.post("/register", (req, res) => {
  UserRegSchema.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(404).json({ message: "Entered email already exists" });
      } else {
        // If email doesn't exists in records
        registration(req, res);
      }
    })
    .catch((error) => console.log(`Registration error: ${error}`));
});

// @type    POST
// @route    /api/auth/login
// @desc    route for login of registered users
// @access  PUBLIC

router.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  UserRegSchema.findOne({ email })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then((correctPassword) => {
            if (!correctPassword) {
              return res.status(401).json({ message: "User login failure" });
            }

            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
            };

            // Generate jwt token and send it back to client
            jsonwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: token,
              });
            });
          })
          .catch((error) => {
            console.log(`Error with passwords: ${error}`);
          });
      } else {
        return res.status(404).json({ message: "Email doesn't exists" });
      }
    })
    .catch((error) => {
      console.log(`Error while login: ${error}`);
    });
});

// @type    GET
//@route    /api/auth/profile
// @desc    route for user profile
// @access  PRIVATE (authenticated using jwt token)

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

// @type    POST
//@route    /api/auth/update
// @desc    route for user profile update of oldpassword with new password
// @access  PRIVATE (authenticated using jwt token)

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const userEmail = req.body.email;
    const oldPassword = req.body.oldPassword;
    let newPassword = req.body.password;

    UserRegSchema.find({ email: userEmail }).then((user) => {
      if (user) {
        bcrypt
          .compare(oldPassword, user[0].password)
          .then((correctPassword) => {
            if (!correctPassword) {
              return res
                .status(401)
                .json({ profileUpdate: "Your old password does not match" });
            }

            // Generated hash of the new password

            bcrypt.genSalt(10, function (err, salt) {
              bcrypt.hash(newPassword, salt, function (hasherr, hash) {
                if (hasherr) throw hasherr;
                newPassword = hash;

                // Update the password in the database
                UserRegSchema.updateOne(
                  { email: userEmail },
                  { $set: { password: newPassword } }
                )
                  .then((data) => {
                    if (!data) {
                      res.status(404).send({
                        passwordUpdateMessage: `Cannot update the password`,
                      });
                    } else
                      res.send({
                        passwordUpdateMessage: "Password was updated successfully.",
                      });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      passwordUpdateMessage: "Error updating password=" + err,
                    });
                  });
              });
            });
          })
          .catch((error) => {
            console.log(`Error with the user object ${error}`);
          });
      } else {
        return res
          .status(404)
          .json({ emailRegistrationError: "Email doesn't exists" });
      }
    });
  }
);
