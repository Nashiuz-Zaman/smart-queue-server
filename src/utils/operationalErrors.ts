import httpStatus from "http-status";
import { AppError } from "../classes";

export const throwBadRequest = (msg: string) => {
  throw new AppError(msg, httpStatus.BAD_REQUEST);
};

export const throwNotFound = (msg: string) => {
  throw new AppError(msg, httpStatus.NOT_FOUND);
};

export const throwUnauthorized = (msg: string = "Unauthorized") => {
  throw new AppError(msg, httpStatus.UNAUTHORIZED);
};

export const throwForbidden = (msg: string = "Forbidden") => {
  throw new AppError(msg, httpStatus.FORBIDDEN);
};

export const throwConflict = (msg: string = "Conflict") => {
  throw new AppError(msg, httpStatus.CONFLICT);
};

export const throwUnprocessableEntity = (
  msg: string = "Unprocessable Entity",
) => {
  throw new AppError(msg, httpStatus.UNPROCESSABLE_ENTITY);
};

export const throwTooManyRequests = (msg: string = "Too many requests") => {
  throw new AppError(msg, httpStatus.TOO_MANY_REQUESTS);
};

export const throwInternalServerError = (
  msg: string = "Operation failed due to server error",
) => {
  throw new AppError(msg, httpStatus.INTERNAL_SERVER_ERROR);
};

export const throwServiceUnavailable = (
  msg: string = "Service Unavailable",
) => {
  throw new AppError(msg, httpStatus.SERVICE_UNAVAILABLE);
};
