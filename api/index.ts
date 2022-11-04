import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import passport from 'passport'
import { router } from './routes/api/Auth.js'
import { passportStrategy } from './strategies/passport.js'
import {
  mongoURL,
  userProfileApplicationPortNumber
} from './setup/constants.js'

const application = express()

application.use(bodyParser.urlencoded({ extended: false }))
application.use(bodyParser.json())

// Connecting to the database
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log('mongoDB has been connected successfully')
  })
  .catch((error) => console.log(`Error while connecting MongoDB: ${error}`))

// middleware
application.use(passport.initialize())
passportStrategy(passport)
application.use('/api/auth', router)

// @type    GET
// @route    /
// @desc    Default route of application
// @access  PUBLIC
application.get('/', (req, res) => {
  res.send('Welcome to user registration application')
})

application.listen(userProfileApplicationPortNumber, () => {
  console.log(
    `Application is listening on port ${userProfileApplicationPortNumber}`
  )
})
