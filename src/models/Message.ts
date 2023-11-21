import { Schema, Types, model } from "mongoose";

export type IMessage = {
  _id: Types.ObjectId;
  authorName: string;
  authorLastName: string;
  authorId: string;
  text: string;
};

const messageSchema = new Schema({
  authorName: { type: String, required: true },
  authorLastName: { type: String, required: true },
  authorId: { type: String, required: true },
  text: { type: String, required: true },
});

export const messageModel = model<IMessage>("MessageModel", messageSchema);
