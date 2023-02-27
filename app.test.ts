const request = require("supertest");
const express = require("express");
const ArticlesRouter = require("./routes/articles");
const UsersRouter = require("./routes/users");
const initializeMongoServer = require("./mongoConfigTesting.ts");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
require("./passport.ts");

import { User } from "./models/user";
import { uploadSampleArticle1, uploadSampleArticle2 } from "./populatedb";

let app;
let connection;
let uri;

beforeAll(async () => {
  ({ connection, uri } = await initializeMongoServer());
  app = express();
  app.use(express.json());
  app.use(
    session({
      secret: "testingSecret",
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: uri }),
    })
  );
  app.use(passport.authenticate("session"));
  app.use("/articles", ArticlesRouter);
  app.use("/users", UsersRouter);
});

afterAll(async () => {
  await connection.close();
});

describe("article retrieval and creation at GET /articles", () => {
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
    request(app)
      .post("/articles")
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors).toStrictEqual([{ message: "Unauthorized" }]);
        done();
      });
  });
});

describe("user signup at POST /users", () => {
  test("POST /users returns validation errors", (done) => {
    request(app)
      .post("/users")
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("msg");
        done();
      });
  });

  test("POST /users with valid input creates new user", (done) => {
    request(app)
      .post("/users")
      .send({ username: "gary", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        User.findOne({ username: "gary" }).then((res) => {
          expect(res?.username).toStrictEqual("gary");
          done();
        });
      });
  });

  test("POST /users with existing username returns username already in use", (done) => {
    request(app)
      .post("/users")
      .send({ username: "copy1", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) =>
        request(app)
          .post("/users")
          .send({ username: "copy1", password: "5678" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors[0]).toHaveProperty("msg");
            expect(res.body.errors[0].msg).toStrictEqual(
              "Username already in use"
            );
            done();
          })
      );
  });
});

describe("user login at POST /users/login", () => {
  test("POST /users/login with no body returns validation errors", (done) => {
    request(app)
      .post("/users/login")
      .end((err, res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("msg");
        done();
      });
  });

  test("POST /users/login with non-existant user returns error", (done) => {
    request(app)
      .post("/users/login")
      .send({ username: "thisuserdoesnotexist", password: "1234" })
      .set("content-type", "application/json")
      .expect("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toStrictEqual({
          message: "Username or password is incorrect",
        });
        done();
      });
  });

  test("POST /users/login with incorrect password returns error", (done) => {
    request(app)
      .post("/users")
      .send({ username: "testuser1", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        request(app)
          .post("/users/login")
          .send({ username: "testuser1", password: "not1234" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors[0]).toStrictEqual({
              message: "Username or password is incorrect",
            });
            done();
          });
      });
  });

  test("POST /users/login with valid credentials returns user", (done) => {
    request(app)
      .post("/users")
      .send({ username: "testuser2", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        request(app)
          .post("/users/login")
          .send({ username: "testuser2", password: "1234" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toStrictEqual({
              success: true,
            });
            done();
          });
      });
  });
});

describe("user retrieval at /users/current", () => {
  test("GET /users/current when not logged in return unauthorized", (done) => {
    request(app)
      .get("/users/current")
      .end((err, res) => {
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toStrictEqual({ message: "Unauthorized" });
        done();
      });
  });

  test("GET /users/current returns user after login", (done) => {
    request(app)
      .post("/users")
      .send({ username: "testuser3", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        request(app)
          .post("/users/login")
          .send({ username: "testuser3", password: "1234" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toStrictEqual({
              success: true,
            });
            request(app)
              .get("/users/current")
              .set("Cookie", [...res.header["set-cookie"]])
              .end((err, res) => {
                expect(res.body).toHaveProperty("_id");
                expect(res.body).toHaveProperty("liked");
                expect(res.body.liked).toStrictEqual([]);
                expect(res.body).toHaveProperty("saved");
                expect(res.body.saved).toStrictEqual([]);
                expect(res.body).toHaveProperty("username");
                expect(res.body.username).toStrictEqual("testuser3");
                done();
              });
          });
      });
  });
});

describe("user logout at POST /users/logout", () => {
  test("POST /users/logout returns error when not logged in", (done) => {
    request(app)
      .post("/users/logout")
      .end((err, res) => {
        expect(res.body).toStrictEqual({
          errors: [{ message: "No user found" }],
        });
        done();
      });
  });

  test("POST /users/logout returns success after login and fails next user request", (done) => {
    request(app)
      .post("/users")
      .send({ username: "testuser4", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        request(app)
          .post("/users/login")
          .send({ username: "testuser4", password: "1234" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toStrictEqual({
              success: true,
            });
            request(app)
              .post("/users/logout")
              .set("Cookie", [...res.header["set-cookie"]])
              .end((err, res) => {
                console.log(res.body);
                expect(res.body).toStrictEqual({ success: true });

                request(app)
                  .get("/users/current")
                  .set("Cookie", [...res.header["set-cookie"]])
                  .end((err, res) => {
                    expect(res.body).toStrictEqual({
                      errors: [{ message: "Unauthorized" }],
                    });
                    done();
                  });
              });
          });
      });
  });
});

describe("user deletion at DELETE /users/:userId", () => {
  test("DELETE /users/:userId returns unauthorized when not logged in", (done) => {
    request(app)
      .delete("/users/012345678901234567890123")
      .end((err, res) => {
        expect(res.body).toStrictEqual({
          errors: [{ message: "Unauthorized" }],
        });
        done();
      });
  });

  test("DELETE /users/:userId successfully deletes user if logged in", (done) => {
    request(app)
      .post("/users")
      .send({ username: "testuser5", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        request(app)
          .post("/users/login")
          .send({ username: "testuser5", password: "1234" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toStrictEqual({
              success: true,
            });
            const cookie = [...res.header["set-cookie"]];
            request(app)
              .get("/users/current")
              .set("Cookie", cookie)
              .end((err, res) => {
                expect(res.body).toHaveProperty("_id");
                const userToDelete = res.body._id;
                request(app)
                  .delete(`/users/${userToDelete}`)
                  .set("Cookie", cookie)
                  .end((err, res) => {
                    expect(res.body).toStrictEqual({
                      success: true,
                    });
                    User.findById(userToDelete, (err, res) => {
                      expect(res).toStrictEqual(null);
                      done();
                    });
                  });
              });
          });
      });
  });

  test("DELETE /users/:userId fails to delete user if user to be deleted does not match user logged in", (done) => {
    request(app)
      .post("/users")
      .send({ username: "testuser6", password: "1234" })
      .set("content-type", "application/json")
      .end((err, res) => {
        expect(res.body).toStrictEqual({ saved: true });
        request(app)
          .post("/users")
          .send({ username: "testuser7", password: "1234" })
          .set("content-type", "application/json")
          .end((err, res) => {
            expect(res.body).toStrictEqual({ saved: true });
            request(app)
              .post("/users/login")
              .send({ username: "testuser6", password: "1234" })
              .set("content-type", "application/json")
              .end((err, res) => {
                expect(res.body).toStrictEqual({
                  success: true,
                });
                const cookie = [...res.header["set-cookie"]];
                User.findOne({ username: "testuser7" }, (err, res) => {
                  expect(res).toHaveProperty("_id");
                  const userToDelete = res._id;
                  request(app)
                    .delete(`/users/${userToDelete}`)
                    .set("Cookie", cookie)
                    .end((err, res) => {
                      expect(res.body).toStrictEqual({
                        errors: [{ message: "Unauthorized" }],
                      });
                      User.findById(userToDelete, (err, res) => {
                        expect(res).toHaveProperty("_id");
                        expect(res).toHaveProperty("username");
                        expect(res).toHaveProperty("password");
                        done();
                      });
                    });
                });
              });
          });
      });
  });
});

test("DELETE /users/:userId successfully deletes user after login", (done) => {
  request(app)
    .post("/users")
    .send({ username: "testuser0", password: "1234" })
    .set("content-type", "application/json")
    .end((err, res) => {
      expect(res.body).toStrictEqual({ saved: true });
      request(app)
        .post("/users/login")
        .send({ username: "testuser0", password: "1234" })
        .set("content-type", "application/json")
        .end((err, res) => {
          expect(res.body).toStrictEqual({
            success: true,
          });
          request(app)
            .post("/users/logout")
            .set("Cookie", [...res.header["set-cookie"]])
            .end((err, res) => {
              console.log(res.body);
              expect(res.body).toStrictEqual({ success: true });

              request(app)
                .get("/users/current")
                .set("Cookie", [...res.header["set-cookie"]])
                .end((err, res) => {
                  expect(res.body).toStrictEqual({
                    errors: [{ message: "Unauthorized" }],
                  });
                  done();
                });
            });
        });
    });
});
