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

//---------Create Patient----------//
describe("POST /patient", () => {
    describe("When first and last name are given", () => {
      test("Should respond with 201 status", async () => {
        const response = await request(app)
          .post("/patient")
          .set("Cookie", cookie)
          .send({
            firstName: "John",
            lastName: "Stevens",
          });
        expect(response.body.firstName).toBe("John");
        expect(response.body.lastName).toBe("Stevens");
        expect(response.statusCode).toBe(201);
      });
    });
  
    describe("When last name is missing", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post("/patient")
          .set("Cookie", cookie)
          .send({
            firstName: "john",
          });
        expect(response.body.message).toBe("Please fill out all fields");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When auth cookie is missing", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app).post("/patient").send({
          firstName: "john",
          lastName: "Stevens",
        });
        expect(response.body.message).toBe("No authorization token found");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Get Patient Info----------//
  describe("GET /patient/:id", () => {
    describe("When valid patient ID is given in URL", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .get("/patient/63f01efe3b5704fa0aa3ddc2")
          .set("Cookie", cookie)
          .send({});
        expect(response.body).toHaveProperty("patient");
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("When invalid patient ID is given in URL", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .get("/patient/63f01efe3b5704fa0aa3ddc9")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("Patient not found");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When user is not affiliated with patient", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .get("/patient/63f01f0a3b5704fa0aa3ddc3")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Update Patient----------//
  describe("PUT /patient/:id", () => {
    describe("When valid patient ID is given in URL", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .put("/patient/63f01efe3b5704fa0aa3ddc2")
          .set("Cookie", cookie)
          .send({
            firstName: "BIG TED",
          });
        expect(response.body.firstName).toBe("BIG TED");
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("When invalid patient ID is given in URL", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .put("/patient/63f01efe3b5704fa0aa3ddc5")
          .set("Cookie", cookie)
          .send({
            firstName: "BIG TED",
          });
        expect(response.body.message).toBe("Patient not found");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When valid patient ID is given, but user is not coordinator", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .put("/patient/63f01f0a3b5704fa0aa3ddc3")
          .set("Cookie", cookie)
          .send({
            firstName: "BIG TED",
          });
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Delete Patient----------//
  describe("DELETE /patient/:id", () => {
    describe("When valid patient ID is given in URL", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .delete("/patient/63f01efe3b5704fa0aa3ddc2")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe(
          "Deleted patient 63f01efe3b5704fa0aa3ddc2"
        );
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("When invalid patient ID is given in URL", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .delete("/patient/63f01efe3b5704fa0aa3ddc5")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("Patient not found");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When valid patient ID is given, but user is not coordinator", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .delete("/patient/63f01f0a3b5704fa0aa3ddc3")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });