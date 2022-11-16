import { UserRegistration } from '../../models/UserRegisterSchema'
import express from 'express'
import bcrypt from 'bcrypt'
import jsonwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config();
import passport from 'passport'
import { jwtTokenPayload, userRegistrationRequestPayload, userRegistrationResponsePayload } from '../../services/typesServices'

export const router = express.Router()

const jwtTokenGeneration = function (payload: jwtTokenPayload) {
  const token = jsonwt.sign(payload, process.env.passportSecretCode, { expiresIn: 3600 })
  return token
}

const registration = async function (req: userRegistrationRequestPayload, res: userRegistrationResponsePayload) {
  const newUser = new UserRegistration({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userName: req.body.userName
  })

  const salt = await bcrypt.genSalt(10)
  const hashpassword = await bcrypt.hash(newUser.password, salt)
  newUser.password = hashpassword
  const userSignup = await newUser.save()

  const payloadForJwt = {
    id: userSignup.id,
    name: userSignup.name,
    email: userSignup.email
  }

  const jwtToken = await jwtTokenGeneration(payloadForJwt)
  res.status(200).json({
    success: true,
    token: jwtToken
  })
}

// @type    POST
// @route   /api/auth/register
// @desc    route for registration of users
// @access  PUBLIC

router.post('/register', (req, res) => {
  UserRegistration.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(404).json({ message: 'Entered email already exists' })
      } else {
        // If email doesn't exists in records
        registration(req, res)
      }
    })
    .catch((error) => console.log(`Registration error: ${error}`))
})

// @type    POST
// @route    /api/auth/login
// @desc    route for login of registered users
// @access  PUBLIC

router.post('/login', (req, res) => {
  const loginPassword = req.body.password
  const loginEmail = req.body.email
  UserRegistration.findOne({ loginEmail })
    .then((user) => {
      if (user) {
        bcrypt
          .compare(loginPassword, user.password)
          .then((correctPassword) => {
            if (!correctPassword) {
              return res.status(401).json({ message: 'User login failure' })
            }

            const payload = {
              id: user.id,
              name: user.name,
              email: user.email
            }

            // Generate jwt token and send it back to client
            jsonwt.sign(payload, process.env.passportSecretCode, { expiresIn: 3600 }, (_err, token) => {
              res.json({
                success: true,
                token
              })
            })
          })
          .catch((error) => {
            console.log(`Error with passwords: ${error}`)
          })
      } else {
        return res.status(404).json({ message: "Email doesn't exists" })
      }
    })
    .catch((error) => {
      console.log(`Error while login: ${error}`)
    })
})

// @type    GET
// @route    /api/auth/profile
// @desc    route for user profile
// @access  PRIVATE (authenticated using jwt token)

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req: any, res: any) => {
    res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    })
  }
)

// @type    POST
// @route    /api/auth/update
// @desc    route for user profile update of oldpassword with new password
// @access  PRIVATE (authenticated using jwt token)

router.post(
  '/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const userEmail : string = req.body.email
    const oldPassword : string = req.body.oldPassword
    let newPassword : string = req.body.password

    UserRegistration.find({ email: userEmail }).then((user) => {
      if (user) {
        bcrypt
          .compare(oldPassword, user[0].password)
          .then((correctPassword) => {
            if (!correctPassword) {
              return res
                .status(401)
                .json({ profileUpdate: 'Your old password does not match' })
            }

            // Generated hash of the new password

            bcrypt.genSalt(10, function (_err, salt) {
              bcrypt.hash(newPassword, salt, function (hasherr, hash) {
                if (hasherr) throw hasherr
                newPassword = hash

                // Update the password in the database
                UserRegistration.updateOne(
                  { email: userEmail },
                  { $set: { password: newPassword } }
                )
                  .then((data) => {
                    if (!data) {
                      res.status(404).send({
                        passwordUpdateMessage: 'Cannot update the password'
                      })
                    } else {
                      res.send({
                        passwordUpdateMessage: 'Password was updated successfully.'
                      })
                    }
                  })
                  .catch((err) => {
                    res.status(500).send({
                      passwordUpdateMessage: 'Error updating password=' + err
                    })
                  })
              })
            })
          })
          .catch((error) => {
            console.log(`Error with the user object ${error}`)
          })
      } else {
        return res
          .status(404)
          .json({ emailRegistrationError: "Email doesn't exists" })
      }
    })
  }
)
