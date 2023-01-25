import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "../routes";
import { errorHandler } from "../middleware/error.middleware";
import { notFoundHandler } from "../middleware/notFound.middleware";
import { deserializeUser } from "../middleware/deserializeUser.middleware";

const createServer = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use(deserializeUser);

  routes(app);

  app.use(errorHandler);
  app.use(notFoundHandler);

  return app;
};

export default createServer;
