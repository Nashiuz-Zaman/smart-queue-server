import bcrypt from "bcrypt";
import { UserModel } from "./auth.model";

export const createUser = async (email: string, password: string) => {
  return UserModel.create({ email, password });
};

export const validateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
};
