import jwt, { VerifyErrors } from "jsonwebtoken";
import { IJwtPayload } from "./generateToken";

type TVerifyResult =
  | { valid: true; decoded: IJwtPayload }
  | { valid: false; error: VerifyErrors };

export const verifyToken = (
  token: string,
  secret: string,
): Promise<TVerifyResult> => {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        resolve({ valid: false, error: err });
      } else {
        // Cast decoded to IJwtPayload safely
        resolve({ valid: true, decoded: decoded as IJwtPayload });
      }
    });
  });
};
