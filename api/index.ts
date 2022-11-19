import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import passport from 'passport'
import { router } from '@authRoutes/Auth'
import { passportStrategy } from '@strategies/passport'
import 'module-alias/register';
const application = express()

application.use(bodyParser.urlencoded({ extended: false }))
application.use(bodyParser.json())

// Connecting to the database
mongoose
  .connect(process.env.mongoDatabaseURL)
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

application.listen(process.env.userProfileApplicationPortNumber, () => {
  console.log(
    `Application is listening on port ${process.env.userProfileApplicationPortNumber}`
  )
})
