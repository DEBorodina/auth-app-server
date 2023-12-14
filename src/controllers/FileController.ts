import { NextFunction, Request, Response } from "express";
import { cryptoService } from "../services/CryptoService";
import { fileService } from "../services/FileService";
import { IFileDto } from "../dtos/FileDto";
import { tokenService } from "../services/TokenService";

class FileController {
  async getFiles(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const key = req.key;
      const files = await fileService.getFiles(id);

      const filesEncrypted = cryptoService.encryptData(files, key);
      console.log(files, JSON.stringify(files));

      return res.json(filesEncrypted);
    } catch (e) {
      next(e);
    }
  }

  async addFile(req: Request, res: Response, next: NextFunction) {
    try {
      let { file } = req.body;

      const key = req.key;
      const { fileName, fileContent } = cryptoService.decryptData(file, key);

      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(" ")[1];
      const { id } = tokenService.validateToken(accessToken);

      const files = await fileService.addFile(fileName, fileContent, id);
      const filesEncrypted = cryptoService.encryptData(files, key);
      console.log(filesEncrypted, key, files);

      return res.json(filesEncrypted);
    } catch (e) {
      next(e);
    }
  }
}

export const fileController = new FileController();
