import { FileDto } from "../dtos/FileDto";
import { IFile, fileModel } from "../models/File";

class FileService {
  async getFiles(authorId: string) {
    const files = await fileModel.find({ authorId });

    const filesDto = files.map((file) => new FileDto(file));
    return filesDto;
  }
}

export const fileService = new FileService();
