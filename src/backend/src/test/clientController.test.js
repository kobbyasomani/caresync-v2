const app = require("../server.js");
const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

let cookie;

beforeAll(async () => {
  mongoose.set("strictQuery", false);
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

//---------Create Client----------//
describe("POST /client", () => {
  describe("first and last name are given", () => {
    test("respond with 201 status/new client object", async () => {
      const response = await request(app)
        .post("/client")
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

  describe("last name is missing", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app)
        .post("/client")
        .set("Cookie", cookie)
        .send({
          firstName: "john",
        });
      expect(response.body.message).toBe("Please fill out all fields");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("auth cookie is missing", () => {
    test("respond with 401 status/specific error message", async () => {
      const response = await request(app).post("/client").send({
        firstName: "john",
        lastName: "Stevens",
      });
      expect(response.body.message).toBe("No authorization token found");
      expect(response.statusCode).toBe(401);
    });
  });
});

//---------Get Client Info----------//
describe("GET /client/:id", () => {
  describe("valid client ID is given in URL", () => {
    test("respond with 200 status/client object", async () => {
      const response = await request(app)
        .get("/client/63f01efe3b5704fa0aa3ddc2")
        .set("Cookie", cookie)
        .send({});
      expect(response.body).toHaveProperty("client");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("invalid client ID is given in URL", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app)
        .get("/client/63f01efe3b5704fa0aa3ddc9")
        .set("Cookie", cookie)
        .send({});
      expect(response.body.message).toBe("Client not found");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("When user is not affiliated with client", () => {
    test("respond with 401 status/specific error message", async () => {
      const response = await request(app)
        .get("/client/63f01f0a3b5704fa0aa3ddc3")
        .set("Cookie", cookie)
        .send({});
      expect(response.body.message).toBe("User is not authorized");
      expect(response.statusCode).toBe(401);
    });
  });
});

//---------Update Client----------//
describe("PUT /client/:id", () => {
  describe("valid client ID is given in URL", () => {
    test("respond with 200 status/updated client object", async () => {
      const response = await request(app)
        .put("/client/63f01efe3b5704fa0aa3ddc2")
        .set("Cookie", cookie)
        .send({
          firstName: "BIG TED",
        });
      expect(response.body.firstName).toBe("BIG TED");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("invalid client ID is given in URL", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app)
        .put("/client/63f01efe3b5704fa0aa3ddc5")
        .set("Cookie", cookie)
        .send({
          firstName: "BIG TED",
        });
      expect(response.body.message).toBe("Client not found");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("valid client ID is given, but user is not coordinator", () => {
    test("respond with 401 status/specific error message", async () => {
      const response = await request(app)
        .put("/client/63f01f0a3b5704fa0aa3ddc3")
        .set("Cookie", cookie)
        .send({
          firstName: "BIG TED",
        });
      expect(response.body.message).toBe("User is not authorized");
      expect(response.statusCode).toBe(401);
    });
  });
});

//---------Delete Client----------//
describe("DELETE /client/:id", () => {
  describe("valid client ID is given in URL", () => {
    test("respond with 200 status/deleted client ID", async () => {
      const response = await request(app)
        .delete("/client/63f01efe3b5704fa0aa3ddc2")
        .set("Cookie", cookie)
        .send({});
      expect(response.body.message).toBe(
        "Deleted client 63f01efe3b5704fa0aa3ddc2"
      );
      expect(response.statusCode).toBe(200);
    });
  });

  describe("invalid client ID is given in URL", () => {
    test("respond with 400 status/specific error message", async () => {
      const response = await request(app)
        .delete("/client/63f01efe3b5704fa0aa3ddc5")
        .set("Cookie", cookie)
        .send({});
      expect(response.body.message).toBe("Client not found");
      expect(response.statusCode).toBe(400);
    });
  });

  describe("valid client ID is given, but user is not coordinator", () => {
    test("respond with 401 status/specific error message", async () => {
      const response = await request(app)
        .delete("/client/63f01f0a3b5704fa0aa3ddc3")
        .set("Cookie", cookie)
        .send({});
      expect(response.body.message).toBe("User is not authorized");
      expect(response.statusCode).toBe(401);
    });
  });
});
