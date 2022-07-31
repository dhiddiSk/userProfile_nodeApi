import passJwt from "passport-jwt";
import * as constant from "../setupSupport/constants"
import passport from "passport";
import UserReg from "../models/UserRegister.js";
const jwtStrategy =  passJwt.Strategy;
const extractJwt = passJwt.ExtractJwt;

const options = {}
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = constant.secret;

passport.use(new jwtStrategy(options, (jwt_payload, done) => {
    UserReg.findById(jwt_payload.id)
        .then(person => {
          if (person) {
            return done(null, person);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
}));
