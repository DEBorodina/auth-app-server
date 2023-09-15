import { NextFunction, Request, Response } from "express";
import { cryptoService } from "../services/CryptoService";

class CryptoController {
  async generateKeyPair(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await cryptoService.generateKeyPair();
      res.json(response);
    } catch (e) {
      next(e);
    }
  }

  async getSecretKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { secretKey } = req.body;
      const sessionId = req.headers["x-session-id"] as string;
      //   console.log(req.headers);
      await cryptoService.getSecretKey(sessionId, secretKey);
      res.json();
    } catch (e) {
      next(e);
    }
  }
}

export const cryptoController = new CryptoController();
