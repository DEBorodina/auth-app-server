import { Types } from "mongoose";
import { IFile } from "../models/File";
import fs from "node:fs";
import { cryptoService } from "../services/CryptoService";

export type IFileDto = {
  authorId: string;
  content: string;
  fileName: string;
  id: Types.ObjectId;
};

export class FileDto {
  authorId: string;
  content: string;
  fileName: string;
  id: Types.ObjectId;

  constructor(model: IFile) {
    this.authorId = model.authorId;
    this.id = model._id;
    this.fileName = model.fileName;

    const aesKey = process.env.FILES_AES_KEY;
    const content = fs.readFileSync(
      `./files/${model.fileHashName}.txt`,
      "utf8"
    );
    this.content = cryptoService.decryptData(content, aesKey);
  }
}
