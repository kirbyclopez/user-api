import { get } from "lodash";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import prisma from "../utils/prisma";
import { findUser } from "./user.service";

interface ISessionQuery {
  id?: number;
  valid?: boolean;
  userAgent?: string;
  createdAt?: string;
  adminId?: number;
}

export const getSession = async (query: ISessionQuery) => {
  const session = await prisma.sessions.findFirst({
    where: query,
  });

  return session;
};

export const createSession = async (adminId: number, userAgent: string) => {
  const session = await prisma.sessions.create({
    data: {
      userAgent,
      adminId,
    },
  });

  return session;
};

export const updateSession = async ({
  id,
  update,
}: {
  id: number;
  update: ISessionQuery;
}) => {
  const session = await prisma.sessions.update({
    where: { id },
    data: update,
  });

  return session;
};

export const reIssueAccessToken = async (refreshToken: string) => {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, "sid")) return false;

  const session = await prisma.sessions.findFirst({
    where: { id: get(decoded, "sid"), valid: true },
  });

  if (!session) return false;

  const admin = await findUser({ id: session.adminId });

  if (!admin) return false;

  const accessToken = signJwt(
    {
      uid: admin.id,
      username: admin.username,
      sid: session.id,
    },
    { expiresIn: process.env.ACCESSTOKENTTL }
  );

  return accessToken;
};
