import { get } from "lodash";
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { getSession } from "../service/session.service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let accessToken = "";

  if (req.header("authorization")) {
    const authorization = req.header("authorization")?.split(" ");

    if (authorization)
      if (authorization[0] !== "Bearer") return next();
      else accessToken = authorization[1];

    if (!accessToken) return next();

    const { decoded } = verifyJwt(accessToken);

    if (!decoded) return next();

    const session = await getSession({ id: get(decoded, "sid"), valid: true });

    if (session) {
      res.locals.user = decoded;
      return next();
    }
  }

  return next();
};
