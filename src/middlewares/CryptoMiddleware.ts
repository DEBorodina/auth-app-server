import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/ApiError";
import { tokenService } from "../services/TokenService";
import { sessionModel } from "../models/Session";

export const cryptoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.headers["x-session-id"];

    if (!sessionId) {
      return next(ApiError.BadRequest("Session id required"));
    }

    const { key } = await sessionModel.findOne({ sessionId });
    req.key = key;
    req.body.sessionId = sessionId;
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
};
