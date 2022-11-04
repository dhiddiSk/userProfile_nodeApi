import passJwt from 'passport-jwt'
import * as constant from '../setup/constants.js'
import mongoose from 'mongoose'
const UserReg = mongoose.model('newUserReg')
const JwtStrategy = passJwt.Strategy
const extractJwt = passJwt.ExtractJwt

const options = {}
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = constant.secret

// passport strategy used by application for authenticating a request

const passportStrategy = (passport) => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
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
