import { PrismaClient } from "@prisma/client";
import { createAdmin } from "./__tests__/factories/admin";
import { createUser } from "./__tests__/factories/user";

const prisma = new PrismaClient();

async function main() {
  try {
    await createAdmin("admin", "password");
    for (let i = 0; i < 20; i++) {
      await createUser();
    }
  } catch (e) {
    console.log("Error in seeding database");
    console.log(e);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
