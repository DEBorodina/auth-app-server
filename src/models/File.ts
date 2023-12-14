import { Schema, Types, model } from "mongoose";

export type IFile = {
  _id: Types.ObjectId;
  authorId: string;
  fileName: string;
  fileHashName: string;
};

const fileSchema = new Schema({
  authorId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileHashName: { type: String, required: true },
});

export const fileModel = model<IFile>("FileModel", fileSchema);
