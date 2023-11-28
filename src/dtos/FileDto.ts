import { Types } from "mongoose";
import { IFile } from "../models/File";
import fs from "node:fs";

export type IFileDto = {
  authorId: string;
  text: string;
  fileName: string;
  id: Types.ObjectId;
};

export class FileDto {
  authorId: string;
  text: string;
  fileName: string;
  id: Types.ObjectId;

  constructor(model: IFile) {
    this.authorId = model.authorId;
    this.id = model._id;
    this.fileName = model.fileName;
    this.text = fs.readFileSync(model.filePath + ".txt", "utf8");
  }
}
