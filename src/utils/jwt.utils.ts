import jwt from "jsonwebtoken";

const secret = (process.env.JWT_SECRET as string) || "";

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, secret, options);
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, secret);

    return { valid: true, expired: false, decoded };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
};
