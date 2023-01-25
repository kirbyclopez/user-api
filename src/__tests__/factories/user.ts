import { faker } from "@faker-js/faker";
import { createUsers } from ".prisma/factory";
import bcrypt from "bcrypt";

export const createUser = async () => {
  const saltWorkFactor = parseInt(process.env.SALTWORKFACTOR || "10");
  const salt = await bcrypt.genSalt(saltWorkFactor);

  let firstname = faker.name.firstName();
  let lastname = faker.name.lastName();
  let password = bcrypt.hashSync(faker.internet.password(), salt);

  return createUsers({
    data: {
      firstname: firstname,
      lastname: lastname,
      address: faker.address.city(),
      postcode: faker.address.zipCode(),
      phone: faker.phone.number("+639#########"),
      email: faker.internet.email(firstname, lastname),
      username: faker.internet.userName(),
      password: password,
    },
  });
};
