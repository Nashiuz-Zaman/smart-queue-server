import { UserModel } from "./user.model";

import { AppError } from "../../utils/appError";
import { ILocalLoginRequest, ISignupRequest } from "./user.type";
import { generateToken, throwBadRequest } from "../../utils";
import { env } from "../../config/env";

export const signupUser = async (userData: ISignupRequest) => {
  const existingUser = await UserModel.findOne({ email: userData.email });
  if (existingUser) {
    return throwBadRequest("Email already in use");
  }

  const user = await UserModel.create(userData);

  const token = generateToken(
    { email: user.email, userId: user._id.toString() },
    env.JWT_SECRET,
    "3d",
  );

  return token;
};

export const loginUser = async (loginData: ILocalLoginRequest) => {
  const { email, password } = loginData;

  if (!email || !password) {
    return throwBadRequest("Please provide email and password");
  }

  const user = await UserModel.auth(email, password);

  const token = generateToken(
    { email: user.email, userId: user._id.toString() },
    env.JWT_SECRET,
    "3d",
  );

  return token;
};

export const demoUserLogin = async () => {
  let demoUser = await UserModel.findOne({ email: "demo@demo.com" });

  if (!demoUser) {
    demoUser = await UserModel.create({
      email: "demo@demo.com",
      password: "demopassword",
    });
  }

  const token = generateToken(
    { email: demoUser.email, userId: demoUser._id.toString() },
    env.JWT_SECRET,
    "3d",
  );

  return token;
};
