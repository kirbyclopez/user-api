import { Express, Request, Response } from "express";
import { userRouter } from "./router/user.router";
import { sessionRouter } from "./router/session.router";

const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send({ msg: "User API v1.0.0" });
  });

  app.use("/api/auth", sessionRouter);
  app.use("/api/users", userRouter);
};

export default routes;
