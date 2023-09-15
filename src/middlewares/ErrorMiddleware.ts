import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/ApiError";

export const errorMiddleware = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  if (err instanceof ApiError) {
    const { status, message, errors } = err;
    res.status(status).json({ message, errors });
  }

  res.status(500).json({ message: "Unexpected error" });
};
