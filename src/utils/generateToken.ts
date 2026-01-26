import jwt, { JwtPayload } from "jsonwebtoken";

export interface IJwtPayload extends JwtPayload {
  userId?: string;
  email?: string;
}

type TTimeUnit = "ms" | "s" | "m" | "h" | "d" | "w" | "y";

export interface ISignOptions {
  expiresIn?: number | `${number}${TTimeUnit}`;
}

export const generateToken = (
  payload: IJwtPayload,
  secret: string,
  expiresIn: ISignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};
