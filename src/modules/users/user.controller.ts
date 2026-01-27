import { Request, Response } from "express";
import { UserService } from "./user.service";
import {
  catchAsync,
  cleanCookie,
  sendSuccess,
  setCookie,
  throwInternalServerError,
} from "../../utils";
import { AuthRequest } from "../../middlewares/auth.middleware";

const cookieMaxAge = 3 * 24 * 60 * 60 * 1000;

/* Signup User */
export const signup = catchAsync(async (req: Request, res: Response) => {
  const isCreated = await UserService.signupUser(req.body);

  if (isCreated) {
    return sendSuccess(res);
  }

  return throwInternalServerError("User sigunp failed");
});

/* Login User */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { user, token } = await UserService.loginUser(req.body);

  if (token) {
    setCookie(res, {
      cookieName: "accessToken",
      cookieContent: token,
      maxAge: cookieMaxAge,
    });
    return sendSuccess(res, { data: user });
  }

  return throwInternalServerError();
});

/* Demo Login */
export const demoLogin = catchAsync(async (_req: Request, res: Response) => {
  const { user, token } = await UserService.demoUserLogin();

  if (token) {
    setCookie(res, {
      cookieName: "accessToken",
      cookieContent: token,
      maxAge: cookieMaxAge,
    });
    return sendSuccess(res, { data: user });
  }

  return throwInternalServerError();
});

/* Current User */
export const checkAuth = catchAsync(async (req: AuthRequest, res) => {
  const { email } = req;

  const user = await UserService.getUser(email as string);

  if (user?._id) {
    return sendSuccess(res, { data: user });
  }

  return throwInternalServerError();
});

/* Logout User */
export const logout = catchAsync(async (_req: Request, res: Response) => {
  cleanCookie(res, "accessToken");
  return sendSuccess(res);
});
