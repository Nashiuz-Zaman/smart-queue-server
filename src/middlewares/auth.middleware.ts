import { Request, Response, NextFunction } from "express";
import { catchAsync, throwUnauthorized, verifyToken } from "../utils";

export interface AuthRequest extends Request {
  email?: string;
}

export const protect = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token) {
      return throwUnauthorized();
    }

    const result = await verifyToken(token, process.env.JWT_SECRET as string);

    if (!result.valid) {
      return throwUnauthorized();
    }

    req.email = result.decoded.email;
    return next();
  },
);
