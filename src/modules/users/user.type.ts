import { Types, Model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILocalLoginRequest {
  email: string;
  password: string;
}
export interface ISignupRequest {
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUser> {
  auth(email: string, password: string): Promise<Omit<IUser, "password">>;
}
