import { Response } from "express";

interface ICleanCookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  domain?: string;
  path?: string;
}

export const cleanCookie = (
  res: Response,
  cookieName: string,
  {
    httpOnly = true,
    secure = true,
    sameSite = "none",
    domain = process.env.NODE_ENV !== "production"
      ? "localhost"
      : "lumora-server.vercel.app",
    path = "/",
  }: ICleanCookieOptions = {}
): void => {
  res.clearCookie(cookieName, {
    httpOnly,
    secure,
    sameSite,
    domain,
    path,
  });

  res.cookie(cookieName, "", {
    expires: new Date(0),
    httpOnly,
    secure,
    sameSite,
    domain,
    path,
  });
};
