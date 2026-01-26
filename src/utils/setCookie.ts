import { Response } from "express";

interface ICookieOptions {
  cookieName: string;
  cookieContent: string | Record<string, any>;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  domain?: string;
  path?: string;
}

export const setCookie = (
  res: Response,
  {
    cookieName,
    cookieContent,
    maxAge = 10 * 60 * 1000, // default 10 mins
    httpOnly = true,
    secure = true,
    sameSite = "none",
    domain = process.env.NODE_ENV !== "production"
      ? "localhost"
      : "lumora-server.vercel.app",
    path = "/",
  }: ICookieOptions
) => {
  res.cookie(cookieName, cookieContent, {
    maxAge,
    httpOnly,
    secure,
    sameSite,
    domain,
    path,
  });
};
