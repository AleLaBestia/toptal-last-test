const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../server");

describe("Auth service test", () => {
  afterAll(done => {
    mongoose.disconnect();
    app.close(done);
  });

  test("login with incorrect email and password", async () => {
    request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@gmail.com",
        password: "A@dfwer923"
      })
      .then(response => {
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe(
          "Not found. Please check your email and password again. They do not match."
        );
      });
  });
});
