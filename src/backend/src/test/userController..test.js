const app = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

let cookie;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const response = await request(app).post("/user/login").send({
    email: "john@example.com",
    password: "password",
  });

  cookie = response.get("Set-Cookie");
});

afterAll(async () => {
  await Promise.resolve().then(mongoose.connection.close());
});

//---------User Creation----------//
describe("POST /user/register", () => {
  describe("given firstName, lastName, email and password", () => {
    test("respond with 201 status/the new user object", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Daniels",
        email: "sickemail@gmail.com",
        password: "password",
      });
      expect(response.body.firstName).toBe("John");
      expect(response.body.lastName).toBe("Daniels");
      expect(response.body.email).toBe("sickemail@gmail.com");
      expect(response.statusCode).toBe(201);
    });
  });

  describe("given user information that already exists in the DB", () => {
    test("respond with 400 status/proper error message", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
      });
      expect(response.body.message).toBe(
        "This email is associated with an account already."
      );
      expect(response.statusCode).toBe(400);
    });
  });

  describe("firstName, lastName, email and password are missing", () => {
    test("respond with 400 status/proper error message", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Daniels",
      });
      expect(response.body.message).toBe("Please fill out all fields");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("invalid email format", () => {
    test("respond with message about improper email", async () => {
      const res = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        password: "password",
        email: "notemailformat",
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        "User validation failed: email: Please add an email"
      );
    });
  });

  describe("invalid password length", () => {
    test("respond with message about improper email", async () => {
      const res = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        password: "pass",
        email: "email@email.com",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Passwords must be more than 8 characters long");
    });
  });
});

//---------User Verification----------//
describe("POST /verification/:token", () => {
  describe("given valid verification JWT in the URL", () => {
    test("respond with 200 status/success message", async () => {
      const response = await request(app)
        .post(
          "/user/verification/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzY3Njg5Nzh9.qCjcQ_xMutz35bDd8_olh36e5Z11thoPnXR0hrrbUUg"
        )
        .send({});
      expect(response.body.message).toBe("Email successfully confirmed.");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("given invalid verification JWT in the URL", () => {
    test("respond with 400 status/proper error message", async () => {
      const response = await request(app)
        .post(
          "/user/verification/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR0am9tc2xhbmRqckBnbWFpbC5jb20iLCJpYXQiOjE2NzY3NzAzMDMsImV4cCI6MTY3OTM2MjMwM30.j6uaGEE5t3rAdSj-o2YJyFQHfBzBD_mzTXY_0JVYf8g"
        )
        .send({});
      expect(response.body.message).toBe("User not found");
      expect(response.statusCode).toBe(401);
    });
  });
});

//---------User Login----------//
describe("POST /user/login", () => {
  describe("given email and password", () => {
    test("respond with 200 status/success message", async () => {
      const response = await request(app).post("/user/login").send({
        email: "john@example.com",
        password: "password",
      });
      expect(response.body.message).toBe("Logged in Successfully");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("password is missing", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app).post("/user/login").send({
        email: "john@example.com",
      });
      expect(response.body.message).toBe("Please fill out all fields");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("password is wrong", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app).post("/user/login").send({
        email: "john@example.com",
        password: "password2",
      });
      expect(response.body.message).toBe("Invalid credentials");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("user is unconfirmed", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app).post("/user/login").send({
        email: "kobby@gmail.com",
        password: "password",
      });
      expect(response.body.message).toBe("Please confirm your email");
      expect(response.statusCode).toBe(400);
    });
  });
});

//---------User Info----------//
describe("GET /user", () => {
  describe("given user ID from cookie", () => {
    test("should respond with 200 status", async () => {
      const response = await request(app)
        .get("/user")
        .set("Cookie", cookie)
        .send({});
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("coordinator");
      expect(response.body).toHaveProperty("carer");
    });
  });

  describe("not given user ID from cookie", () => {
    test("should respond with 401 status/specific error message", async () => {
      const response = await request(app).get("/user").send({});
      expect(response.body.message).toBe("No authorization token found");
      expect(response.statusCode).toBe(401);
    });
  });
});
