import prisma from "../utils/prisma";
import bcrypt from "bcrypt";

interface IAdminQuery {
  id?: number;
  username?: string;
}

export const validatePassword = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await prisma.admins.findUnique({
    where: { username: username },
  });

  if (!user) return false;

  const isValid = await bcrypt
    .compare(password, user.password)
    .catch((e) => false);

  if (!isValid) return false;

  return {
    id: user.id,
    username: user.username,
  };
};

export const findAdmin = async (query: IAdminQuery) => {
  const admin = await prisma.admins.findFirst({
    where: query,
  });
  return admin;
};
