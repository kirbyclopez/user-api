require("dotenv").config({ path: ".env.test" });

import request from "supertest";
import createServer from "../utils/server";
import prisma from "../utils/prisma";
import bcrypt from "bcrypt";

const app = createServer();

let accessToken = "";
let expiredAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJzaWQiOjEsImlhdCI6MTY3NDY2NjM2NSwiZXhwIjoxNjc0NjY2NjY1fQ.1vy8V89ME3tmEDOPR8cTtvQKWrdqpdcxkWYJSkh5URQ";

const validAdminPayload = {
  username: "admin",
  password: "password",
};

const userPayloadMissingField = {
  lastname: "Lee",
  address: "Taguig City, Metro Manila",
  postcode: "1603",
  phone: "+639129876543",
  email: "may.lee@email.com",
  username: "may.lee",
  password: "passwordofmay",
};

const userPayload = {
  firstname: "Jeth",
  lastname: "Lee",
  address: "Pasig City, Metro Manila",
  postcode: "1608",
  phone: "+639129876543",
  email: "jeth.lee@email.com",
  username: "jeth.lee",
  password: "passwordofjeth",
};

const updateUserPayload = {
  firstname: "Kate",
  lastname: "Davis",
  address: "Marikina City, Metro Manila",
  postcode: "1600",
  phone: "+639127764352",
  email: "kate.davis@email.com",
  username: "kate.davis",
  password: "passwordofkate",
};

const patchUserPayload = {
  address: "Mandaluyong City, Metro Manila",
  postcode: "1601",
  phone: "+639091128695",
};

const idsPayload = [6, 7, 8, 9, 10];
const idsPayloadWithNonExisting = [11, 12, 100];
const idsPayloadAllNonExisting = [101, 102, 103];

beforeAll(async () => {
  const result = await request(app)
    .post("/api/auth/login")
    .send(validAdminPayload);

  accessToken = result.body.accessToken;

  const saltWorkFactor = parseInt(process.env.SALTWORKFACTOR || "10");
  const salt = await bcrypt.genSalt(saltWorkFactor);

  userPayload.password = bcrypt.hashSync(userPayload.password, salt);
  updateUserPayload.password = bcrypt.hashSync(
    updateUserPayload.password,
    salt
  );
});

afterAll(async () => {
  await request(app)
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${accessToken}`);

  await prisma.$disconnect();
});

describe("Users resource test suite", () => {
  describe("GET /api/users tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).get("/api/users");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .get("/api/users")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided", () => {
      it("should return status 200 and users", async () => {
        const result = await request(app)
          .get("/api/users")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].id).toBeDefined();
      });
    });
  });

  describe("GET /api/users/:userId tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).get("/api/users/1");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .get("/api/users/1")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided but the userId does not exist", () => {
      it("should return status 404 and message", async () => {
        const result = await request(app)
          .get("/api/users/100")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided and userId exists", () => {
      it("should return status 200 and user", async () => {
        const result = await request(app)
          .get("/api/users/1")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(200);
        expect(result.body.id).toBe(1);
        expect(result.body.firstname).toBeDefined();
      });
    });
  });

  describe("POST /api/users tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).post("/api/users");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .post("/api/users")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided but a required field is missing", () => {
      it("should return status 400 and error message", async () => {
        const result = await request(app)
          .post("/api/users")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(userPayloadMissingField);

        expect(result.statusCode).toBe(400);
        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].message).toBe("First name is required");
      });
    });

    describe("given a valid accessToken is provided and complete user fields", () => {
      it("should return status 201 and created user", async () => {
        const result = await request(app)
          .post("/api/users")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(userPayload);

        expect(result.statusCode).toBe(201);
        expect(result.body.id).toBeGreaterThan(1);
        expect(result.body.firstname).toBe(userPayload.firstname);
      });
    });
  });

  describe("PUT /api/users/:userId tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).put("/api/users/1");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .put("/api/users/1")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided but the userId does not exist", () => {
      it("should return status 404 and message", async () => {
        const result = await request(app)
          .put("/api/users/100")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(updateUserPayload);

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided but a required field is missing", () => {
      it("should return status 400 and error message", async () => {
        const result = await request(app)
          .put("/api/users/1")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(userPayloadMissingField);

        expect(result.statusCode).toBe(400);
        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].message).toBe("First name is required");
      });
    });

    describe("given a valid accessToken is provided and complete user fields", () => {
      it("should return status 200 and updated user", async () => {
        const result = await request(app)
          .put("/api/users/1")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(updateUserPayload);

        expect(result.statusCode).toBe(200);
        expect(result.body.id).toBeGreaterThan(0);
        expect(result.body.firstname).toBe(updateUserPayload.firstname);
      });
    });
  });

  describe("PATCH /api/users/:userId tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).patch("/api/users/1");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .patch("/api/users/1")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided but the userId does not exist", () => {
      it("should return status 404 and message", async () => {
        const result = await request(app)
          .patch("/api/users/100")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(patchUserPayload);

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided and with field(s) to update", () => {
      it("should return status 200 and updated user", async () => {
        const result = await request(app)
          .patch("/api/users/1")
          .set("Authorization", `Bearer ${accessToken}`)
          .send(patchUserPayload);

        expect(result.statusCode).toBe(200);
        expect(result.body.id).toBeGreaterThan(0);
        expect(result.body.phone).toBe(patchUserPayload.phone);
      });
    });
  });

  describe("DELETE /api/users/:userId tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).delete("/api/users/2");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .delete("/api/users/2")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided but the userId does not exist", () => {
      it("should return status 404 and message", async () => {
        const result = await request(app)
          .delete("/api/users/100")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided and userId exists", () => {
      it("should return status 200 and updated user", async () => {
        const result = await request(app)
          .delete("/api/users/2")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe("User was successfully deleted.");
      });
    });
  });

  describe("POST /api/users/deleteByIds tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).post("/api/users/deleteByIds");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return a 403", async () => {
        const result = await request(app)
          .post("/api/users/deleteByIds")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided but no ids in the body", () => {
      it("should return status 400 and message", async () => {
        const result = await request(app)
          .post("/api/users/deleteByIds")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(400);
        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].message).toBe("Required");
      });
    });

    describe("given a valid accessToken is provided and ids is an empty array", () => {
      it("should return status 404 and message", async () => {
        const result = await request(app)
          .post("/api/users/deleteByIds")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ ids: [] });

        expect(result.statusCode).toBe(404);
        expect(result.body.message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided and ids are all non existing userId", () => {
      it("should return status 404 and message", async () => {
        const result = await request(app)
          .post("/api/users/deleteByIds")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ ids: idsPayloadAllNonExisting });

        expect(result.statusCode).toBe(404);
        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided and ids has both existing and non existing userId", () => {
      it("should return status 200 and message", async () => {
        const result = await request(app)
          .post("/api/users/deleteByIds")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ ids: idsPayloadWithNonExisting });

        expect(result.statusCode).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        expect(result.body[0].message).toBe("Resource not found");
      });
    });

    describe("given a valid accessToken is provided and ids are all existing userId", () => {
      it("should return status 200 and message", async () => {
        const result = await request(app)
          .post("/api/users/deleteByIds")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ ids: idsPayload });

        expect(result.statusCode).toBe(200);
        expect(result.body.message).toBe("Users were successfully deleted.");
      });
    });
  });
});
