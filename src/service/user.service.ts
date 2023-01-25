import prisma from "../utils/prisma";
import bcrypt from "bcrypt";

interface IUser {
  id?: number;
  firstname: string;
  lastname: string;
  address?: string;
  postcode?: string;
  phone?: string;
  email: string;
  username: string;
  password: string;
}

type IUserQuery = Partial<IUser>;

export const createUser = async (input: IUser) => {
  const saltWorkFactor = parseInt(process.env.SALTWORKFACTOR || "10");
  const salt = await bcrypt.genSalt(saltWorkFactor);

  input.password = bcrypt.hashSync(input.password, salt);

  const user = await prisma.users.create({
    data: input,
  });

  return user;
};

export const findUsers = async () => {
  const users = await prisma.users.findMany();
  return users;
};

export const findUser = async (query: IUserQuery) => {
  const user = await prisma.users.findFirst({
    where: query,
  });
  return user;
};

export const findAndReplaceUser = async ({
  query,
  update,
}: {
  query: IUserQuery;
  update: IUser;
}) => {
  const saltWorkFactor = parseInt(process.env.SALTWORKFACTOR || "10");
  const salt = await bcrypt.genSalt(saltWorkFactor);

  update.password = bcrypt.hashSync(update.password, salt);

  const user = await prisma.users.update({
    where: query,
    data: update,
  });
  return user;
};

export const findAndUpdateUser = async ({
  query,
  update,
}: {
  query: IUserQuery;
  update: IUserQuery;
}) => {
  if (update.password) {
    const saltWorkFactor = parseInt(process.env.SALTWORKFACTOR || "10");
    const salt = await bcrypt.genSalt(saltWorkFactor);

    update.password = bcrypt.hashSync(update.password, salt);
  }

  const user = await prisma.users.update({
    where: query,
    data: update,
  });
  return user;
};

export const deleteUser = async (query: IUserQuery) => {
  const user = await prisma.users.delete({
    where: query,
  });
  return user;
};

export const clearUsers = async () => {
  await prisma.users.deleteMany();
};
