import express, { NextFunction, Request, Response, text } from "express";

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
const bcrypt = require("bcryptjs");

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

app.get("/articles", (req: Request, res: Response, next: NextFunction) => {
  Article.find(
    {},
    { content: 0 },
    (err: Error | null, articles: articleI[]) => {
      if (err) return res.json(err);
      return res.json(articles);
    }
  );
});

app.post("/articles", [
  body("title")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Title must be specified")
    .isLength({ max: 200 })
    .withMessage("Title must not exceed 200 characters"),
  body("author")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Author must be specified")
    .isLength({ max: 200 })
    .withMessage("Author must not exceed 200 characters"),
  body("imageAlt")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Image alternate must be specified")
    .isLength({ max: 200 })
    .withMessage("Image alternate must not exceed 200 characters"),
  body("image").custom((image) => {
    if (!image) return Promise.reject("Image must be specified");
    // file limit is 1MB (1048576 bytes), but buffer returns larger size than original image
    // using 1548576 to provide extra space
    if (Buffer.from(image).length > 1548576)
      return Promise.reject("Image must not exceed 1MB");
    return true;
  }),
  body("content").custom((content) => {
    if (content.length <= 0) return Promise.reject("Body must not be empty");
    if (
      content.filter((e: { type: string }) => e.type === "paragraph").length <=
      0
    )
      return Promise.reject("Body must include at least one paragraph");
    return true;
  }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors);

    let textBrief = "";
    for (let e of req.body.content) {
      if (e.type === "paragraph") {
        textBrief = e.text;
        break;
      }
    }

    const article = new Article({
      title: req.body.title,
      textBrief: textBrief,
      author: req.body.author,
      created: new Date(),
      image: req.body.image,
      imageAlt: req.body.imageAlt,
      content: req.body.content,
    });

    article.save((err, result) => {
      if (err) return next(err);
      return res.json({ saved: true });
    });
  },
]);

app.get(
  "/articles/:articleId",
  (req: Request, res: Response, next: NextFunction) => {
    Article.findById(
      req.params.articleId,
      (err: Error | null, article: articleI) => {
        if (err) return res.json(err);
        return res.json(article);
      }
    );
  }
);

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

    bcrypt.hash(req.body.password, 10, (err: any, hashedPassword: string) => {
      if (err) return next(err);

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        saved: [],
      });

      user.save((err, result) => {
        if (err) return res.json(err);
        return res.json({ saved: true });
      });
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
    ? res.json({
        _id: req.user._id,
        username: req.user.username,
        saved: req.user.saved,
      })
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

app.delete(
  "/users/:userId",
  (req: Request, res: Response, next: NextFunction) => {
    User.findByIdAndDelete(req.params.userId, (err: any, result: any) => {
      if (err) return next(err);
      else return res.json({ success: true });
    });
  }
);

app.post(
  "/users/:userId/saved",
  (req: Request, res: Response, next: NextFunction) => {
    if (Number(req.body.toStatus) === 1) {
      User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { saved: req.body.articleId } },
        (err: any, result: any) => {
          if (err) return next(err);
          else return res.json({ result: 1 });
        }
      );
    } else {
      User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { saved: req.body.articleId } },
        (err: any, result: any) => {
          if (err) return next(err);
          else return res.json({ result: 0 });
        }
      );
    }
  }
);

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
