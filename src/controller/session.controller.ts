import { Request, Response } from "express";
import { validatePassword } from "../service/admin.service";
import {
  createSession,
  reIssueAccessToken,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../utils/jwt.utils";

export const createUserSessionHandler = async (req: Request, res: Response) => {
  const admin = await validatePassword(req.body);

  if (!admin) return res.status(401).send({ message: "Invalid credentials" });

  const session = await createSession(admin.id, req.get("user-agent") || "");

  const accessToken = signJwt(
    {
      uid: admin.id,
      username: admin.username,
      sid: session.id,
    },
    { expiresIn: process.env.ACCESSTOKENTTL }
  );

  const refreshToken = signJwt(
    {
      uid: admin.id,
      username: admin.username,
      sid: session.id,
    },
    { expiresIn: process.env.REFRESHTOKENTTL }
  );

  return res.send({ accessToken, refreshToken });
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.sid;

  await updateSession({ id: sessionId, update: { valid: false } });

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};

export const createAccessTokenHandler = async (req: Request, res: Response) => {
  const refreshToken = req.header("authorization")?.split(" ")[1];

  if (!refreshToken) return res.status(403).send("Forbidden");

  const newAccessToken = await reIssueAccessToken(refreshToken);

  if (!newAccessToken) return res.status(403).send("Forbidden");

  return res.status(201).send({ accessToken: newAccessToken });
};
