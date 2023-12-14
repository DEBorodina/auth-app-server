import { FileDto } from "../dtos/FileDto";
import { fileModel } from "../models/File";
import { cryptoService } from "./CryptoService";
import fs from "fs";
import { MD5 } from "crypto-js";

class FileService {
  async getFiles(authorId: string) {
    const files = await fileModel.find({ authorId });

    const filesDto = files.map((file) => new FileDto(file));
    return filesDto;
  }

  async addFile(fileName: string, fileContent: string, authorId: string) {
    const aesKey = process.env.FILES_AES_KEY;
    const encryptedContent = cryptoService.encryptData(fileContent, aesKey);
    const fileHashName = MD5(fileName + fileContent + authorId);

    if (!fs.existsSync("./files")) {
      fs.mkdirSync("./files");
    }

    fs.writeFileSync(`./files/${fileHashName}.txt`, encryptedContent);

    await fileModel.create({ fileName, fileHashName, authorId });

    const files = await this.getFiles(authorId);

    return files;
  }
}

export const fileService = new FileService();
