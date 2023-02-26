import express, { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { Article, articleI } from "../models/article";
import mongoose from "mongoose";
const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.query.before)
    Article.find(
      { _id: { $lt: req.query.before } },
      { _id: 1 },
      (err: Error | null, articles: { _id: string }[]) => {
        if (err) return res.json(err);
        return res.json(articles.map((a) => a._id));
      }
    )
      .sort({ _id: -1 }) // sort by created
      .limit(10);
  else
    Article.find(
      {},
      { _id: 1 },
      (err: Error | null, articles: { _id: string }[]) => {
        if (err) return res.json(err);
        return res.json(articles.map((a) => a._id));
      }
    )
      .sort({ _id: -1 }) // sort by created
      .limit(10);
});

router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.json({ errors: [{ message: "Unauthorized" }] });
    next();
  },
  [
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
    body("authorId")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Unauthorized")
      .isLength({ max: 200 })
      .withMessage("Invalid credentials"),
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
        content.filter((e: { type: string }) => e.type === "paragraph")
          .length <= 0
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
        authorId: new mongoose.Types.ObjectId(req.body.authorId),
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
  ]
);

router.get("/:articleId", (req: Request, res: Response, next: NextFunction) => {
  Article.findById(
    req.params.articleId,
    (err: Error | null, article: articleI) => {
      if (err) return res.json(err);
      if (!article)
        return res.json({ errors: [{ message: "No article found" }] });
      return res.json(article);
    }
  );
});

module.exports = router;
