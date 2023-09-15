import { Types } from "mongoose";
import { IUser } from "../models/User";

export class UserDto {
  email: string;
  id: Types.ObjectId;
  isActivated: boolean;
  name: string;
  lastName: string;

  constructor(model: IUser) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.lastName = model.lastName;
  }
}
