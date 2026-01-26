import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "./user.type";
import { AppError } from "../../classes/AppError";
import { throwBadRequest, throwUnauthorized } from "../../utils";

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// presave hook
userSchema.pre("save", async function () {
  try {
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (err) {
    throw new AppError((err as Error).message);
  }
});

// Login for email
userSchema.statics.auth = async function (email: string, password: string) {
  const user = await UserModel.findOne(
    { email },
    {
      password: 1,
      email: 1,
    },
  );

  if (!user || !user.password)
    return throwBadRequest("Invalid email or password");

  // If password checking is required here:
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return throwUnauthorized("Incorrect password");

  const plainUser = user.toObject();

  //  strip unnecessary stuff
  delete plainUser.password;

  return plainUser;
};

export const UserModel = model<IUser, IUserModel>("User", userSchema);
