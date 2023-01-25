import { createAdmins } from ".prisma/factory";
import bcrypt from "bcrypt";

export const createAdmin = async (username: string, password: string) => {
  const saltWorkFactor = parseInt(process.env.SALTWORKFACTOR || "10");
  const salt = await bcrypt.genSalt(saltWorkFactor);

  return createAdmins({
    data: {
      username,
      password: bcrypt.hashSync(password, salt),
      sessions: undefined,
    },
  });
};
