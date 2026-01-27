import { UserModel } from "./user.model";
import { ILocalLoginRequest, ISignupRequest } from "./user.type";
import { generateToken, throwBadRequest } from "../../utils";
import { env } from "../../config/env";

export const signupUser = async (signupData: ISignupRequest) => {
  const existingUser = await UserModel.findOne({ email: signupData.email });
  if (existingUser) {
    return throwBadRequest("Email already in use");
  }

  const user = await UserModel.create(signupData);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  const token = generateToken(
    { email: user.email, userId: user._id.toString() },
    env.JWT_SECRET,
    "3d",
  );

  return { user, token };
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

  return { user, token };
};

export const demoUserLogin = async () => {
  let demoUser = await UserModel.findOne({ email: "demo@demo.com" });

  if (!demoUser) {
    demoUser = await UserModel.create({
      email: "demo@demo.com",
      password: "demopassword",
    });
  }

  const userWithoutPassword = demoUser.toObject();
  delete userWithoutPassword.password;

  const token = generateToken(
    { email: demoUser.email, userId: demoUser._id.toString() },
    env.JWT_SECRET,
    "3d",
  );

  return { user: userWithoutPassword, token };
};

export const getUser = async (email: string) => {
  return await UserModel.findOne({ email }, { password: 0 });
};

export const UserService = {
  signupUser,
  loginUser,
  demoUserLogin,
  getUser,
};
