const app = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


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
  await mongoose.connection.close();
});

//---------User Creation----------//
describe("POST /user/register", () => {
  describe("Given firstName, lastName, email and password", () => {
    test("should respond with 200 status", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Daniels",
        email: "sickemail@gmail.com",
        password: "password",
      });
      expect(response.statusCode).toBe(201);
    });
  });

  describe("When firstName, lastName, email and password are missing", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Daniels",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});

//---------User Login----------//
describe("POST /user/login", () => {
  describe("Given email and password", () => {
    test("should respond with 200 status", async () => {
      const response = await request(app).post("/user/login").send({
        email: "john@example.com",
        password: "password",
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("When password is missing", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app).post("/user/login").send({
        email: "john@example.com",
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("When password is wrong", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app).post("/user/login").send({
        email: "john@example.com",
        password: "password2",
      });
      expect(response.statusCode).toBe(400);
    });
  });
});

//---------Create Patient----------//
describe("POST /patient", () => {
    describe("When first and last name are given", () => {
        test("Should respond with 200 status", async () => {
          const response = await request(app).post("/patient").set("Cookie", cookie).send({
            firstName: "John",
            lastName: "Stevens"
          });
          expect(response.statusCode).toBe(201);
        });
      });

  describe("When last name is missing", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app).post("/patient").set("Cookie", cookie).send({
        firstName: "john",
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("When auth cookie is missing", () => {
    test("Should respond with 401 status", async () => {
      const response = await request(app).post("/patient").send({
        firstName: "john",
        lastName: "Stevens"
      });
      expect(response.statusCode).toBe(401);
    });
  });
});
