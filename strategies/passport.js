import passJwt from "passport-jwt";
import * as constant from "../setup/constants.js";
import mongoose from "mongoose";
const UserReg = mongoose.model("newUserReg");
const jwtStrategy = passJwt.Strategy;
const extractJwt = passJwt.ExtractJwt;

const options = {};
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = constant.secret;

// passport strategy used by application for authenticating a request

export const passportStrategy = (passport) => {
  passport.use(
    new jwtStrategy(options, (jwt_payload, done) => {
      UserReg.findById(jwt_payload.id)
        .then((person) => {
          if (person) {
            return done(null, person);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
