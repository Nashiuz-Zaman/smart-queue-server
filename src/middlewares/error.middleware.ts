import { Request, Response, NextFunction } from "express";
import { AppError } from "../classes/AppError";
import mongoose from "mongoose";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  // 1. AppError: trusted operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // 2. Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((el: any) => el.message);
    return res.status(400).json({
      status: "fail",
      message: messages.join(", "),
    });
  }

  // 3. Mongoose CastError (e.g. invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // 4. Handle duplicate key error
  if ((err as any).code === 11000) {
    const dupKey = Object.keys((err as any).keyValue)[0];
    return res.status(400).json({
      status: "fail",
      message: `Duplicate value for ${dupKey}`,
    });
  }

  // 5. Unexpected internal error
  console.error("UNEXPECTED ERROR 💥", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};
