import { Request, Response } from "express";
import { demoUserLogin, loginUser, signupUser } from "./user.service";

import { UserModel } from "./user.model";
import {
  catchAsync,
  cleanCookie,
  sendSuccess,
  setCookie,
  throwInternalServerError,
} from "../../utils";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const token = signupUser(req.body);

  if (token) {
    setCookie(res, { cookieName: "accessToken", cookieContent: token });
    return sendSuccess(res);
  }

  return throwInternalServerError();
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const token = await loginUser(req.body);
  if (token) {
    setCookie(res, { cookieName: "accessToken", cookieContent: token });
    return sendSuccess(res);
  }

  return throwInternalServerError();
});

export const demoLogin = async (_req: Request, res: Response) => {
  const token = await demoUserLogin();
  if (token) {
    setCookie(res, { cookieName: "accessToken", cookieContent: token });
    return sendSuccess(res);
  }

  return throwInternalServerError();
};

export const logout = (_req: Request, res: Response) => {
  cleanCookie(res, "accessToken");
  return sendSuccess(res);
};
