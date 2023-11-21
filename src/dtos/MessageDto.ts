import { Types } from "mongoose";
import { IMessage } from "../models/Message";

export class MessageDto {
  authorName: string;
  authorLastName: string;
  authorId: string;
  text: string;
  id: Types.ObjectId;

  constructor(model: IMessage) {
    this.authorId = model.authorId;
    this.id = model._id;
    this.authorName = model.authorName;
    this.authorLastName = model.authorLastName;
    this.text = model.text;
  }
}
