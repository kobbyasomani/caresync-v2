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

//---------Get User Shifts----------//
describe("GET /shift", () => {
    describe("when user is logged in", () => {
      test("respond with 200 status", async () => {
        const response = await request(app)
          .get("/shift")
          .set("Cookie", cookie)
          .send({});
        expect(response.statusCode).toBe(200);
      });
    });
  });
  
  //---------Get Patient Shifts----------//
  describe("GET /shift/:patientID", () => {
    describe("when the user is associated with the patient", () => {
      test("should respond with 200 status", async () => {
        const response = await request(app)
          .get("/shift/63f01efe3b5704fa0aa3ddc4")
          .set("Cookie", cookie)
          .send({});
        expect(response.statusCode).toBe(200);
      });
    });
    describe("when the user isn't associated with the patient", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .get("/shift/63f01f0a3b5704fa0aa3ddc3")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
    describe("When the patient doesn't exist", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .get("/shift/63f01f0a3b5704fa0aa3ddc7")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("Patient not found");
        expect(response.statusCode).toBe(400);
      });
    });
  });
  
  //---------Create Shifts----------//
  describe("POST /shift/:patientID", () => {
    describe("When the coordinator creates a shift for the patient", () => {
      test("Should respond with 201 status", async () => {
        const response = await request(app)
          .post("/shift/63f01efe3b5704fa0aa3ddc8")
          .set("Cookie", cookie)
          .send({
            carerID: "63f0b95a0098e28d58f7a2d5",
            shiftStartTime: "2023-03-02T09:00:00.000+00:00",
            shiftEndTime: "2023-03-02T12:00:00.000+00:00",
            coordinatorNotes:
              "Please take notes on erratic behaviors for the psychologist",
          });
        expect(response.body.patient).toBe("63f01efe3b5704fa0aa3ddc8");
        expect(response.body.coordinator).toBe("63f0b95a0098e28d58f7a25d");
        expect(response.body.carer).toBe("63f0b95a0098e28d58f7a2d5");
        expect(response.body.coordinatorNotes).toBe(
          "Please take notes on erratic behaviors for the psychologist"
        );
        expect(response.body.shiftStartTime).toBe(
          "2023-03-02T09:00:00.000+00:00"
        );
        expect(response.body.shiftEndTime).toBe("2023-03-02T12:00:00.000+00:00");
        expect(response.statusCode).toBe(201);
      });
    });
    describe("When the patient does not exist", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post("/shift/63f01efe3b5704fa0aa3ddc6")
          .set("Cookie", cookie)
          .send({
            carerID: "63f0b95a0098e28d58f7a2d5",
            shiftStartTime: "2023-03-02T09:00:00.000+00:00",
            shiftEndTime: "2023-03-02T12:00:00.000+00:00",
            coordinatorNotes:
              "Please take notes on erratic behaviors for the psychologist",
          });
        expect(response.body.message).toBe("Patient not found");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("When the user is not the coordinator for the patient", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .post("/shift/63f01f0a3b5704fa0aa3ddc5")
          .set("Cookie", cookie)
          .send({
            carerID: "63f0b95a0098e28d58f7a2d5",
            shiftStartTime: "2023-03-02T09:00:00.000+00:00",
            shiftEndTime: "2023-03-02T12:00:00.000+00:00",
            coordinatorNotes:
              "Please take notes on erratic behaviors for the psychologist",
          });
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Update Shift----------//
  describe("POST /shift/:shiftID", () => {
    describe("When the coordinator updates a shift for the patient", () => {
      test("Should respond with 201 status", async () => {
        const response = await request(app)
          .put("/shift/63f01f0a3b5704fa0aa3ddc9")
          .set("Cookie", cookie)
          .send({
            shiftStartTime: "2023-03-02T10:00:00.000+00:00",
            shiftEndTime: "2023-03-02T13:00:00.000+00:00",
            coordinatorNotes: "New coordinator notes",
          });
        expect(response.body.coordinatorNotes).toBe("New coordinator notes");
        expect(response.body.shiftStartTime).toBe("2023-03-02T10:00:00.000Z");
        expect(response.body.shiftEndTime).toBe("2023-03-02T13:00:00.000Z");
        expect(response.statusCode).toBe(201);
      });
    });
    describe("When the user is not the coordinator for the patient", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .put("/shift/63f01f0a3b5704fa0aa3ddd8")
          .set("Cookie", cookie)
          .send({
            shiftStartTime: "2023-03-02T09:00:00.000+00:00",
            shiftEndTime: "2023-03-02T12:00:00.000+00:00",
            coordinatorNotes:
              "Please take notes on erratic behaviors for the psychologist",
          });
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Delete Shift----------//
  describe("POST /shift/:shiftID", () => {
    describe("When the coordinator updates deletes a shift", () => {
      test("Should respond with 201 status", async () => {
        const response = await request(app)
          .delete("/shift/63f01f0a3b5704fa0aa3ddc9")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe(
          "Deleted shift 63f01f0a3b5704fa0aa3ddc9"
        );
        expect(response.statusCode).toBe(200);
      });
    });
    describe("When the user deletes the shift without proper auth", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .delete("/shift/63f01f0a3b5704fa0aa3ddd8")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Create Shift Notes----------//
  describe("POST /notes/:shiftID", () => {
    describe("When the carer creates shift notes", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .post("/shift/notes/63f01f0a3b5704fa0aa3ddc6")
          .set("Cookie", cookie)
          .send({
            shiftNotes:
              "These are new shift notes that will be turned in to a pdf for cloudinary to handle",
          });
        expect(response.body).toHaveProperty("shiftNotes");
        expect(response.statusCode).toBe(200);
      });
    });
  
    describe("When the carer does not enter shift notes", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post("/shift/notes/63f01f0a3b5704fa0aa3ddc6")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("Please fill out all fields");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("When shift notes are entered by someone who is not the carer", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .post("/shift/notes/63f01f0a3b5704fa0aa3ddc8")
          .set("Cookie", cookie)
          .send({
            shiftNotes:
              "These are new shift notes that will be turned in to a pdf for cloudinary to handle",
          });
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  
  //---------Create Incident report----------//
  describe("POST /reports/:shiftID", () => {
    describe("When the carer creates shift notes", () => {
      test("Should respond with 200 status", async () => {
        const response = await request(app)
          .post("/shift/reports/63f01f0a3b5704fa0aa3ddc6")
          .set("Cookie", cookie)
          .send({
            incidentReport:
              "This is a new incident report that will be turned in to a pdf for cloudinary to handle",
          });
        expect(response.body).toHaveProperty("incidentReports");
        expect(response.statusCode).toBe(200);
      });
    });
    describe("When the carer does not enter shift notes", () => {
      test("Should respond with 400 status", async () => {
        const response = await request(app)
          .post("/shift/reports/63f01f0a3b5704fa0aa3ddc6")
          .set("Cookie", cookie)
          .send({});
        expect(response.body.message).toBe("Please fill out all fields");
        expect(response.statusCode).toBe(400);
      });
    });
    describe("When shift notes are entered by someone who is not the carer", () => {
      test("Should respond with 401 status", async () => {
        const response = await request(app)
          .post("/shift/reports/63f01f0a3b5704fa0aa3ddc8")
          .set("Cookie", cookie)
          .send({
            incidentReport:
              "This is a new incident report that will be turned in to a pdf for cloudinary to handle",
          });
        expect(response.body.message).toBe("User is not authorized");
        expect(response.statusCode).toBe(401);
      });
    });
  });
  