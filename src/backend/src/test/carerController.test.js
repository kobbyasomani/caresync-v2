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


//---------Invite Carer----------//
describe("POST /carer/invite/:id", () => {
    describe("When a valid carer email/id is provided", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .post("/carer/invite/63f01efe3b5704fa0aa3ddc4")
          .set("Cookie", cookie)
          .send({
            email: "frank@example.com",
          });
        expect(response.body.message).toBe("Email Sent");
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("When a valid carer email is provided but invalid id is provided", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post("/carer/invite/63f1a4d11f2991daee0c83a2")
          .set("Cookie", cookie)
          .send({
            email: "frank@example.com",
          });
        expect(response.body.message).toBe("Patient not found");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When an invalid carer email is provided but valid patient id is provided", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post("/carer/invite/63f01efe3b5704fa0aa3ddc4")
          .set("Cookie", cookie)
          .send({
            email: "fakeemail@example.com",
          });
        expect(response.body.message).toBe("Carer has not made an account yet");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When user does not have coordinator privileges", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .post("/carer/invite/63f01f0a3b5704fa0aa3ddc5")
          .set("Cookie", cookie)
          .send({
            email: "frank@example.com",
          });
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Add Carer----------//
  describe("POST /carer/add/:token", () => {
    describe("When a valid addition token is provided", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .post(
            "/carer/add/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJlcklEIjoiNjNmMGI5NWEwMDk4ZTI4ZDU4ZjdhMmQxIiwicGF0aWVudElEIjoiNjNmMDFlZmUzYjU3MDRmYTBhYTNkZGM0IiwiaWF0IjoxNjc2NzgzMDI2LCJleHAiOjE2NzkzNzUwMjZ9.4aHTxtrEiPk62PqF75G8OnNMDCGvHmPMKgVCXW04bqA"
          )
          .send({});
        expect(response.body.carers).toContain("63f0b95a0098e28d58f7a2d1");
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("Try adding the same carer twice", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post(
            "/carer/add/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJlcklEIjoiNjNmMGI5NWEwMDk4ZTI4ZDU4ZjdhMmQxIiwicGF0aWVudElEIjoiNjNmMDFlZmUzYjU3MDRmYTBhYTNkZGM0IiwiaWF0IjoxNjc2NzgzMDI2LCJleHAiOjE2NzkzNzUwMjZ9.4aHTxtrEiPk62PqF75G8OnNMDCGvHmPMKgVCXW04bqA"
          )
          .send({});
        expect(response.body.message).toBe("Carer already exists");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("When carer does not have account yet", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post(
            "/carer/add/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYXJlcklEIjoiNjNmMGI5NWEwMDk4ZTI4ZDU4ZjdhMmQzIiwicGF0aWVudElEIjoiNjNmMDFlZmUzYjU3MDRmYTBhYTNkZGM0IiwiaWF0IjoxNjc3MzM0MDk0LCJleHAiOjE2Nzk5MjYwOTR9.MGfr86okT7CfxIPTizaV91U0wzT0b8VcCxBXNg3fCq0"
          )
          .send({});
        expect(response.body.message).toBe("Carer has not made an account yet");
        expect(response.statusCode).toBe(400);
      });
    });
  });
  
  //---------Remove Carer----------//
  describe("DELETE carer/remove/:patientID/:carerID", () => {
    describe("When a valid patient and carerID is provided", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .delete(
            "/carer/remove/63f01efe3b5704fa0aa3ddc4/63f0b95a0098e28d58f7a2d1"
          )
          .set("Cookie", cookie)
          .send({});
        expect(response.body.carers).toHaveLength(0);
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("When an invalid patient and valid carerID is provided", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .delete(
            "/carer/remove/63f01efe3b5704fa0aa3ddc5/63f0b95a0098e28d58f7a2d1"
          )
          .set("Cookie", cookie)
          .send({});
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When a valid patient and invalid carerID is provided", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .delete(
            "/carer/remove/63f01efe3b5704fa0aa3ddc4/63f0b95a0098e28d58f7a2d9"
          )
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("Carer does not exist");
        expect(response.statusCode).toBe(400);
      });
    });
  
    describe("When the user does not have coordinator privileges", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .delete(
            "/carer/remove/63f01f0a3b5704fa0aa3ddc3/63f0b95a0098e28d58f7a25e"
          )
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });