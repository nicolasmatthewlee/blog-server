const request = require("supertest");
const express = require("express");
const ArticlesRouter = require("./routes/articles");
const initializeMongoServer = require("./mongoConfigTesting.ts");

import { uploadSampleArticle1, uploadSampleArticle2 } from "./populatedb";

const app = express();
app.use("/articles", ArticlesRouter);

let connection;

beforeAll(async () => {
  connection = await initializeMongoServer();
});

afterAll(async () => {
  await connection.close();
});

test("GET /articles returns empty array when database is empty", (done) => {
  request(app)
    .get("/articles")
    .expect("content-type", "application/json; charset=utf-8")
    .expect([], done);
});

test("GET /articles returns correct article after upload", (done) => {
  uploadSampleArticle1().then((res) => {
    request(app)
      .get("/articles")
      .expect("content-type", "application/json; charset=utf-8")
      .expect([String(res)], done);
  });
});

test("GET /articles/:articleId returns correct article after upload", (done) => {
  uploadSampleArticle2().then(async (res) => {
    const response = await request(app)
      .get(`/articles/${String(res)}`)
      .expect("content-type", "application/json; charset=utf-8");
    expect(response.body._id).toBe(String(res));
    done();
  });
});

test("POST /articles returns unauthorized", (done) => {
  const response = request(app)
    .post("/articles")
    .expect("content-type", "application/json; charset=utf-8")
    .end((err, res) => {
      expect(res.body).toHaveProperty("errors");
      expect(res.body.errors).toStrictEqual([{ message: "Unauthorized" }]);
      done();
    });
});

// !!! for this will need to add logging in

// test("POST /articles with empty body when logged in returns array of validation errors", (done) => {
//   request(app)
//     .post("/articles")
//     .expect("content-type", "application/json; charset=utf-8")
//     .end((err, res) => {
//       expect(res.body).toHaveProperty("errors");
//       expect(res.body.errors[0]).toHaveProperty("msg");
//     });
//   done();
// });
