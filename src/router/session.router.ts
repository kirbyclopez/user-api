import express from "express";
import {
  createAccessTokenHandler,
  createUserSessionHandler,
  deleteSessionHandler,
} from "../controller/session.controller";
import requireUser from "../middleware/requireUser.middleware";
import validateResource from "../middleware/validateResource.middleware";
import { createSessionSchema } from "../schema/session.schema";

export const sessionRouter = express.Router();

// Admin Login
sessionRouter.post(
  "/login",
  validateResource(createSessionSchema),
  createUserSessionHandler
);

// Admin Logout
sessionRouter.post("/logout", requireUser, deleteSessionHandler);

// Generate Access Token
sessionRouter.post("/tokens", requireUser, createAccessTokenHandler);
