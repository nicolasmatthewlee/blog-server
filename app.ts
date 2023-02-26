import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import cors from "cors";
const session = require("express-session");
import MongoStore from "connect-mongo";
const passport = require("passport");
require("./passport.ts");

const ArticlesRouter = require("./routes/articles");
const UsersRouter = require("./routes/users");

declare module "express" {
  export interface Request {
    user?: any;
    login?: Function;
    logout?: Function;
    sessionID?: any;
  }
}

mongoose.connect(process.env.mongo ?? "").catch((err: Error) => {
  throw err;
});
mongoose.connection.on("error", (err: Error) => {
  if (err) throw err;
});

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ credentials: true, origin: "http://127.0.0.1:3000" }));
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.mongo }),
  })
);
app.use(passport.authenticate("session"));

app.use("/articles", ArticlesRouter);
app.use("/users", UsersRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    console.error(err.stack);
    res
      .status(500)
      .json({ errors: [{ message: "An unknown error occurred" }] });
  }
});

app.listen(process.env.port, () =>
  console.log(`listening at port ${process.env.port}...`)
);
