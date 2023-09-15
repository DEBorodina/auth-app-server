import { Schema, Types, model } from "mongoose";

export interface ISession {
  _id: Types.ObjectId;
  privateKey: string;
  sessionId: string;
  key?: string;
}

const sessionSchema = new Schema({
  privateKey: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true },
  key: { type: String },
});

export const sessionModel = model<ISession>("SessionModel", sessionSchema);
