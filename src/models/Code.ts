import { Schema, Types, model } from "mongoose";

export type ICode = {
  _id: Types.ObjectId;
  userId: string;
  part: 0 | 1;
  code: string;
};

const codeSchema = new Schema({
  userId: { type: String, required: true },
  part: { type: Number, enum: [0, 1], required: true },
  code: { type: String, required: true },
});

export const codeModel = model<ICode>("CodeModel", codeSchema);
