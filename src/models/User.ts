import { Schema, Types, model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  lastName: string;
}

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
});

export const userModel = model<IUser>("UserModel", userSchema);
