import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user";
import { Notification } from "../models/notification";
import { userI } from "../models/user";
const passport = require("passport");
const bcrypt = require("bcryptjs");
const router = Router();

router.get("/current", [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user)
      return res.json({
        _id: req.user._id,
        username: req.user.username,
        saved: req.user.saved,
        liked: req.user.liked,
      });
    else return res.json({ errors: [{ message: "Unauthorized" }] });
  },
]);

router.post("/login", [
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

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return res.json({ errors: [{ message: "No user found" }] });
  if (req.logout)
    return req.logout((err: any) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  next();
});

router.post("/", [
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
        liked: [],
        notifications: [],
      });

      user.save((err, result) => {
        if (err) return res.json(err);
        return res.json({ saved: true });
      });
    });
  },
]);

router.delete("/:userId", [
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || String(req.user._id) !== req.params.userId)
      return res.json({ errors: [{ message: "Unauthorized" }] });
    else next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    User.findByIdAndDelete(req.params.userId, (err: any, result: any) => {
      if (err) {
        if (err.name === "CastError")
          return res.json({ errors: [{ message: "Invalid user id" }] });
        else return next(err);
      } else {
        if (result) return res.json({ success: true });
        else return res.json({ errors: [{ message: "No user found" }] });
      }
    });
  },
]);

router.post(
  "/:userId/saved",
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

router.post(
  "/:userId/liked",
  (req: Request, res: Response, next: NextFunction) => {
    if (Number(req.body.toStatus) === 1) {
      User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { liked: req.body.articleId } },
        (err: any, result: any) => {
          if (err) return next(err);
          else return res.json({ result: 1 });
        }
      );
    } else {
      User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { liked: req.body.articleId } },
        (err: any, result: any) => {
          if (err) return next(err);
          else return res.json({ result: 0 });
        }
      );
    }
  }
);

router.post(
  "/:authorId/notifications",
  (req: Request, res: Response, next: NextFunction) => {
    const notification = new Notification({
      user: req.body.userId,
      event: req.body.event,
      time: new Date(),
      resource: req.body.resource,
    });

    notification.save((err, createdNotification) => {
      if (err) return next(err);

      User.findByIdAndUpdate(
        req.params.authorId,
        { $addToSet: { notifications: createdNotification._id } },
        (err: any, result: any) => {
          if (err) return next(err);
          else return res.json({ success: true });
        }
      );
    });
  }
);

router.get(
  "/:userId/notifications",
  (req: Request, res: Response, next: NextFunction) => {
    Notification.find({
      _id: {
        $in: req.user.notifications,
      },
    })
      .populate("resource", "title")
      .populate("user", "username")
      .exec((err: any, notifications) => {
        if (err) return next(err);
        return res.json(notifications);
      });
  }
);

module.exports = router;
