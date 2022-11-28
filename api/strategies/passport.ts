import passJwt from 'passport-jwt'
import mongoose from 'mongoose'
import * as constants from '../setup/constants'

const UserReg = mongoose.model(constants.userRegistrationModel)
const JwtStrategy = passJwt.Strategy
const extractJwt = passJwt.ExtractJwt

const option: {jwtFromRequest, secretOrKey} = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.passportSecretCode
};

// passport strategy used by application for authenticating a request
const passportStrategy = (passport) => {
  passport.use(
    new JwtStrategy(option, (jwt_payload, done) => {
      UserReg.findById(jwt_payload.id)
        .then((person) => {
          if (person) {
            return done(null, person)
          }
          return done(null, false)
        })
        .catch((err) => console.log(err))
    })
  )
}

export { passportStrategy }
