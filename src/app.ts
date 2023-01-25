if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  const envFile = process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV}`
    : ".env";
  dotenv.config({ path: envFile });
}

import createServer from "./utils/server";

const port = process.env.PORT || 5000;

const app = createServer();

app.listen(port, () => {
  console.log(`Server is listening at port ${port}...`);
});
