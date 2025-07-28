import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

export const configurePassport = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id);

        if (user) {
          return done(null, user);
        } else {
          return done(err, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
