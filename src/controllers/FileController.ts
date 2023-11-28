import { NextFunction, Request, Response } from "express";
import { cryptoService } from "../services/CryptoService";
import { fileService } from "../services/FileService";
import { IFileDto } from "../dtos/FileDto";

class FileController {
  async getFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const key = req.key;
      const files = await fileService.getFiles(id);

      const filesEncrypted = cryptoService.encryptData(files, key);

      return res.json(filesEncrypted);
    } catch (e) {
      next(e);
    }
  }
}

export const fileController = new FileController();
