import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
mongoose.set("strictQuery", false);
import { Article, articleI } from "./models/article";
import { User, userI } from "./models/user";
import cors from "cors";
import { body, validationResult } from "express-validator";
const session = require("express-session");
import MongoStore from "connect-mongo";
const passport = require("passport");
require("./passport.ts");

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
app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.get("/articles", (req, res, next) => {
  Article.find(
    {},
    { content: 0 },
    (err: Error | null, articles: articleI[]) => {
      if (err) return res.json(err);
      return res.json(articles);
    }
  );
});

app.get("/articles/:articleId", (req, res, next) => {
  Article.findById(
    req.params.articleId,
    { textBrief: 0 },
    (err: Error | null, article: articleI) => {
      if (err) return res.json(err);
      return res.json(article);
    }
  );
});

app.post("/signup", [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username must be specified")
    .isLength({ max: 50 })
    .withMessage("username must not exceed 50 characters")
    .custom((value) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) return Promise.reject("Username already in use");
      });
    }),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Password must be specified")
    .isLength({ max: 50 })
    .withMessage("password must not exceed 50 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);

    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.save((err, result) => {
      if (err) return res.json(err);
      return res.json({ saved: true });
    });
  },
]);

app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.mongo }),
  })
);

app.use(passport.authenticate("session"));

app.post("/signin", [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username must be specified")
    .isLength({ max: 50 })
    .withMessage("username must not exceed 50 characters"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Password must be specified")
    .isLength({ max: 50 })
    .withMessage("password must not exceed 50 characters"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);
    next();
  },
  (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate("local", (err: string, user: userI) => {
      if (err) return next(err);
      if (!user)
        return res.json({
          errors: [{ message: "Username or password is incorrect" }],
        });

      if (req.login)
        req.login(user, (err: string) => {
          if (err) return next(err);
          return res.json({ success: true });
        });
    })(req, res, next),
]);

app.get("/user", (req: Request, res: Response, next: NextFunction) => {
  return req.user
    ? res.json({ _id: req.user._id, username: req.user.username })
    : res.json({ errors: [{ message: "Unauthorized" }] });
});

app.post("/signout", (req: Request, res: Response, next: NextFunction) => {
  if (req.logout)
    return req.logout((err: any) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  next();
});

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
