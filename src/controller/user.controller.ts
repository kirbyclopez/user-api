import { Request, Response } from "express";
import {
  CreateUserInput,
  DeleteMultipleUsersInput,
  DeleteUserInput,
  GetUserInput,
  PatchUserInput,
  UpdateUserInput,
} from "../schema/user.schema";
import {
  clearUsers,
  createUser,
  deleteUser,
  findAndReplaceUser,
  findAndUpdateUser,
  findUser,
  findUsers,
} from "../service/user.service";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);

    return res.status(201).send(user);
  } catch (e: any) {
    console.log(e);
    return res.status(409).send({ message: e.message });
  }
};

export const getUsersHandler = async (req: Request, res: Response) => {
  const users = await findUsers();

  return res.send(users);
};

export const getUserHandler = async (
  req: Request<GetUserInput["params"]>,
  res: Response
) => {
  let id: number;

  try {
    id = parseInt(req.params.userId);
  } catch (e) {
    return res.status(404).send({ message: "Resource not found" });
  }

  const user = await findUser({ id });

  if (!user) return res.status(404).send({ message: "Resource not found" });

  return res.send(user);
};

export const updateUserHandler = async (
  req: Request<UpdateUserInput["params"]>,
  res: Response
) => {
  const update = req.body;
  let id: number;

  try {
    id = parseInt(req.params.userId);
  } catch (e) {
    return res.status(404).send({ message: "Resource not found" });
  }

  const user = await findUser({ id });

  if (!user) return res.status(404).send({ message: "Resource not found" });

  const updatedUser = await findAndReplaceUser({ query: { id }, update });

  return res.send(updatedUser);
};

export const patchUserHandler = async (
  req: Request<PatchUserInput["params"]>,
  res: Response
) => {
  const update = req.body;
  let id: number;

  try {
    id = parseInt(req.params.userId);
  } catch (e) {
    return res.status(404).send({ message: "Resource not found" });
  }

  const user = await findUser({ id });

  if (!user) return res.status(404).send({ message: "Resource not found" });

  const updatedUser = await findAndUpdateUser({ query: { id }, update });

  return res.send(updatedUser);
};

export const deleteUsersHandler = async (req: Request, res: Response) => {
  await clearUsers();

  return res
    .status(200)
    .send({ message: "All users were successfully deleted." });
};

export const deleteUserHandler = async (
  req: Request<DeleteUserInput["params"]>,
  res: Response
) => {
  let id: number;

  try {
    id = parseInt(req.params.userId);
  } catch (e) {
    return res.status(404).send({ message: "Resource not found" });
  }

  const user = await findUser({ id });

  if (!user) return res.status(404).send({ message: "Resource not found" });

  await deleteUser({ id });

  return res.status(200).send({ message: "User was successfully deleted." });
};

export const deleteMultipleUsersHandler = async (
  req: Request<{}, {}, DeleteMultipleUsersInput["body"]>,
  res: Response
) => {
  const ids = req.body.ids;
  let errors: { id: number; message: string }[] = [];

  if (ids.length > 0) {
    for (let id of ids) {
      const user = await findUser({ id });

      if (!user) errors.push({ id: id, message: "Resource not found" });
      else await deleteUser({ id });
    }

    if (errors.length == ids.length) return res.status(404).send(errors);

    if (errors.length > 0) return res.status(200).send(errors);

    return res
      .status(200)
      .send({ message: "Users were successfully deleted." });
  }

  return res.status(404).send({ message: "Resource not found" });
};
