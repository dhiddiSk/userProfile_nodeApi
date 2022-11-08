import passJwt from 'passport-jwt'
import * as constant from '../setup/constants'
import mongoose from 'mongoose'
const UserReg = mongoose.model('newUserRegistration')
const JwtStrategy = passJwt.Strategy
const extractJwt = passJwt.ExtractJwt


const option: {jwtFromRequest: any, secretOrKey: string} = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constant.passportSecretCode
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
