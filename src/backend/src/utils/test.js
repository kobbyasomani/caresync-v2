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
  console.log(cookie);
});

afterAll(async () => {
  await mongoose.connection.close();
});

//---------User Creation----------//
describe("POST /user/register", () => {
  describe("Given firstName, lastName, email and password", () => {
    test("Should respond with 200 status", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Daniels",
        email: "sickemail@gmail.com",
        password: "password",
      });
      expect(response.statusCode).toBe(201);
    });
  });

  describe("Given user information that already exists in the DB", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app).post("/user/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password",
      });
      expect(response.statusCode).toBe(400);
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

//---------User Verification----------//
describe("POST /verification/:token", () => {
  describe("Given valid verification JWT in the URL", () => {
    test("should respond with 200 status", async () => {
      const response = await request(app)
        .post(
          "/user/verification/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE2NzY3Njg5Nzh9.qCjcQ_xMutz35bDd8_olh36e5Z11thoPnXR0hrrbUUg"
        )
        .send({});
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Given invalid verification JWT in the URL", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app)
        .post(
          "/user/verification/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR0am9tc2xhbmRqckBnbWFpbC5jb20iLCJpYXQiOjE2NzY3NzAzMDMsImV4cCI6MTY3OTM2MjMwM30.j6uaGEE5t3rAdSj-o2YJyFQHfBzBD_mzTXY_0JVYf8g"
        )
        .send({});
      expect(response.statusCode).toBe(401);
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

//---------User Info----------//
describe("GET /user/login", () => {
  describe("Given user ID from cookie", () => {
    test("should respond with 200 status", async () => {
      const response = await request(app).get("/user").set("Cookie", cookie).send({
      });
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Not given user ID from cookie", () => {
    test("should respond with 401 status", async () => {
      const response = await request(app).get("/user").send({
      });
      expect(response.statusCode).toBe(401);
    });
  });
});


//---------Create Patient----------//
describe("POST /patient", () => {
  describe("When first and last name are given", () => {
    test("Should respond with 200 status", async () => {
      const response = await request(app)
        .post("/patient")
        .set("Cookie", cookie)
        .send({
          firstName: "John",
          lastName: "Stevens",
        });
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
      expect(response.statusCode).toBe(400);
    });
  });

  describe("When auth cookie is missing", () => {
    test("Should respond with 401 status", async () => {
      const response = await request(app).post("/patient").send({
        firstName: "john",
        lastName: "Stevens",
      });
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
      expect(response.statusCode).toBe(200);
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
      expect(response.statusCode).toBe(200);
    });
  });

  describe("When invalid patient ID is given in URL", () => {
    test("Should respond with 400 status", async () => {
      const response = await request(app)
        .delete("/patient/63f01efe3b5704fa0aa3ddc5")
        .set("Cookie", cookie)
        .send({});
      expect(response.statusCode).toBe(400);
    });
  });

  describe("When valid patient ID is given, but user is not coordinator", () => {
    test("Should respond with 401 status", async () => {
      const response = await request(app)
        .delete("/patient/63f01f0a3b5704fa0aa3ddc3")
        .set("Cookie", cookie)
        .send({});
      expect(response.statusCode).toBe(401);
    });
  });
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
      expect(response.statusCode).toBe(400);
    });
  });

  describe("When user does not have coordinator privileges", () => {
    test("Should respond with 401 status", async () => {
      const response = await request(app)
        .post("/carer/invite/63f01f0a3b5704fa0aa3ddc3")
        .set("Cookie", cookie)
        .send({
          email: "frank@example.com",
        });
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
      expect(response.statusCode).toBe(401);
    });
  });
});
