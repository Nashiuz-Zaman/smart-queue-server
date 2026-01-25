import { Request, Response } from "express";
import { createUser, validateUser } from "./auth.service";
import { signToken } from "../../utils/jwt";
import { cookieOptions } from "../../config/cookie";
import { UserModel } from "./auth.model";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await createUser(email, password);
  const token = signToken(user.id);

  res.cookie("accessToken", token, cookieOptions);
  res.status(201).json({ message: "Signup successful" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await validateUser(email, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user.id);
  res.cookie("accessToken", token, cookieOptions);
  res.json({ message: "Login successful" });
};

export const demoLogin = async (_req: Request, res: Response) => {
  let demoUser = await UserModel.findOne({ email: "demo@demo.com" });

  if (!demoUser) {
    demoUser = await UserModel.create({
      email: "demo@demo.com",
      password: "demopassword",
    });
  }

  const token = signToken(demoUser.id);
  res.cookie("accessToken", token, cookieOptions);
  res.json({ message: "Demo login successful" });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.json({ message: "Logged out" });
};
