require("dotenv").config({ path: ".env.test" });

import request from "supertest";
import createServer from "../utils/server";
import prisma from "../utils/prisma";

const app = createServer();

let accessToken = "";
let refreshToken = "";
let expiredAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJzaWQiOjEsImlhdCI6MTY3NDY2NjM2NSwiZXhwIjoxNjc0NjY2NjY1fQ.1vy8V89ME3tmEDOPR8cTtvQKWrdqpdcxkWYJSkh5URQ";
let expiredRefreshToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJzaWQiOjEsImlhdCI6MTY3NDY2NjM2NiwiZXhwIjoxNjc0NjY4MzY2fQ.jIoRSDrmcBLxY4udoEtcVZ21yF3yBt1BbJnFhQowwEs";

const validAdminPayload = {
  username: "admin",
  password: "password",
};

const invalidAdminPayload = {
  username: "admin",
  password: "incorrect",
};

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Sessions resource test suite", () => {
  describe("POST /api/auth/login tests", () => {
    describe("given the credential provided is invalid", () => {
      it("should return a 401 and message", async () => {
        const result = await request(app)
          .post("/api/auth/login")
          .send(invalidAdminPayload);

        expect(result.statusCode).toBe(401);
        expect(result.body.message).toBe("Invalid credentials");
      });
    });

    describe("given the credential provided is valid", () => {
      it("should return status 200 and tokens", async () => {
        const result = await request(app)
          .post("/api/auth/login")
          .send(validAdminPayload);

        expect(result.statusCode).toBe(200);
        expect(result.body.accessToken).toBeDefined();
        expect(result.body.refreshToken).toBeDefined();

        accessToken = result.body.accessToken;
        refreshToken = result.body.refreshToken;
      });
    });
  });

  describe("POST /api/auth/tokens tests", () => {
    describe("given no refreshToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).post("/api/auth/tokens");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid refreshToken is provided", () => {
      it("should return status 403", async () => {
        const result = await request(app)
          .post("/api/auth/tokens")
          .set("Authorization", `Bearer ${expiredRefreshToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid refreshToken is provided", () => {
      it("should return status 201 and accessToken", async () => {
        const result = await request(app)
          .post("/api/auth/tokens")
          .set("Authorization", `Bearer ${refreshToken}`);

        expect(result.statusCode).toBe(201);
        expect(result.body.accessToken).toBeDefined();
      });
    });
  });

  describe("POST /api/auth/logout tests", () => {
    describe("given no accessToken in the Authorization header", () => {
      it("should return a 403", async () => {
        const result = await request(app).post("/api/auth/logout");

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given an invalid accessToken is provided", () => {
      it("should return status 403", async () => {
        const result = await request(app)
          .post("/api/auth/logout")
          .set("Authorization", `Bearer ${expiredAccessToken}`);

        expect(result.statusCode).toBe(403);
      });
    });

    describe("given a valid accessToken is provided", () => {
      it("should return status 200", async () => {
        const result = await request(app)
          .post("/api/auth/logout")
          .set("Authorization", `Bearer ${accessToken}`);

        expect(result.statusCode).toBe(200);
      });
    });
  });
});
