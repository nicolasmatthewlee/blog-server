const passport = require("passport");
const LocalStrategy = require("passport-local");
import mongoose from "mongoose";
import { User, userI } from "./models/user";
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy((username: string, password: string, cb: Function) => {
    User.findOne({ username: username }, (err: string, user: userI) => {
      if (err) return cb(err);
      if (!user)
        return cb(null, false, { message: "Incorrect username or password" });
      bcrypt.compare(password, user.password, (err: any, res: Boolean) => {
        if (err) return cb(err);
        if (!res)
          return cb(null, false, { message: "Incorrect username or password" });
        else return cb(null, user);
      });
    });
  })
);

passport.serializeUser(
  (user: { _id: mongoose.Types.ObjectId }, cb: Function) => {
    cb(null, { id: user._id });
  }
);
passport.deserializeUser((user: { id: string }, done: Function) => {
  User.findById(user.id, (err: string, user: userI) => done(err, user));
});
