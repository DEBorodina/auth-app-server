import { Schema, Types, model } from "mongoose";

export type IFile = {
  _id: Types.ObjectId;
  authorId: string;
  filePath: string;
  fileName: string;
};

const fileSchema = new Schema({
  authorId: { type: String, required: true },
  filePath: { type: String, required: true },
  fileName: { type: String, required: true },
});

export const fileModel = model<IFile>("FileModel", fileSchema);
