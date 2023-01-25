import express from "express";
import {
  createUserHandler,
  deleteMultipleUsersHandler,
  deleteUserHandler,
  deleteUsersHandler,
  getUserHandler,
  getUsersHandler,
  patchUserHandler,
  updateUserHandler,
} from "../controller/user.controller";
import requireUser from "../middleware/requireUser.middleware";
import validateResource from "../middleware/validateResource.middleware";
import {
  createUserSchema,
  deleteMultipleUsersSchema,
  deleteUserSchema,
  getUserSchema,
  patchUserSchema,
  updateUserSchema,
} from "../schema/user.schema";

export const userRouter = express.Router();

userRouter.get("/", requireUser, getUsersHandler);

userRouter.get(
  "/:userId",
  requireUser,
  validateResource(getUserSchema),
  getUserHandler
);

userRouter.post(
  "/",
  requireUser,
  validateResource(createUserSchema),
  createUserHandler
);

userRouter.put(
  "/:userId",
  requireUser,
  validateResource(updateUserSchema),
  updateUserHandler
);

userRouter.patch(
  "/:userId",
  requireUser,
  validateResource(patchUserSchema),
  patchUserHandler
);

userRouter.delete("/", requireUser, deleteUsersHandler);

userRouter.delete(
  "/:userId",
  requireUser,
  validateResource(deleteUserSchema),
  deleteUserHandler
);

userRouter.post(
  "/deleteByIds",
  requireUser,
  validateResource(deleteMultipleUsersSchema),
  deleteMultipleUsersHandler
);
