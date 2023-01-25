import { number, object, string, TypeOf } from "zod";

const payload = {
  body: object({
    firstname: string({
      required_error: "First name is required",
    }),
    lastname: string({
      required_error: "Last name is required",
    }),
    address: string().optional(),
    postcode: string().optional(),
    phone: string().optional(),
    email: string({
      required_error: "Email is required",
    }),
    username: string({
      required_error: "Username is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  }),
};

const patchPayload = {
  body: object({
    firstname: string().optional(),
    lastname: string().optional(),
    address: string().optional(),
    postcode: string().optional(),
    phone: string().optional(),
    email: string().optional(),
    username: string().optional(),
    password: string().optional(),
  }),
};

const deleteMultiplePayload = {
  body: object({
    ids: number({
      required_error: "User ID is required",
    }).array(),
  }),
};

const params = {
  params: object({
    userId: string({
      required_error: "User ID is required",
    }),
  }),
};

export const getUserSchema = object({ ...params });
export const createUserSchema = object({ ...payload });
export const updateUserSchema = object({ ...payload, ...params });
export const patchUserSchema = object({ ...patchPayload, ...params });
export const deleteUserSchema = object({ ...params });
export const deleteMultipleUsersSchema = object({ ...deleteMultiplePayload });

export type GetUserInput = TypeOf<typeof getUserSchema>;
export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type PatchUserInput = TypeOf<typeof patchUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
export type DeleteMultipleUsersInput = TypeOf<typeof deleteMultipleUsersSchema>;
