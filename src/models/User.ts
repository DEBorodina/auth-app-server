import { Schema, Types, model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  activationLink?: string;
  isActivated: boolean;
  name: string;
  lastName: string;
  code?: number | null;
  isCodeVerified?: boolean;
}

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  isCodeVerified: { type: Boolean, default: false },
  code: { type: Number, default: null },
});

export const userModel = model<IUser>("UserModel", userSchema);
