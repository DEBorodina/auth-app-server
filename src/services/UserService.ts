import { userModel } from "../models/User";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { mailService } from "./MailService";
import { tokenService } from "./TokenService";
import { UserDto } from "../dtos/UserDto";
import { ApiError } from "../exceptions/ApiError";
import { sessionModel } from "../models/Session";
import { codeModel } from "../models/Code";
import { codeService } from "./CodeService";

class UserService {
  async registration(
    email: string,
    password: string,
    name: string,
    lastName: string
  ) {
    const candidate = await userModel.findOne({ email });

    if (candidate) {
      throw ApiError.BadRequest("Email already in use");
    }

    const hashPassword = bcrypt.hashSync(password, 3);

    const user = await userModel.create({
      email,
      password: hashPassword,
      name,
      lastName,
    });

    const userDto = new UserDto(user);
    const userId = String(userDto.id);
    //const accessToken = tokenService.generateToken({ ...userDto });

    await codeService.generateCodeForUser(userId);
    await mailService.sendVerifyCode(email, userId);

    return userId;
  }

  async verifyUserWithCode(
    code: string,
    userId: string
  ): Promise<{ user: UserDto; token: string }> {
    const user = await userModel.findById(userId);
    const actualCode = await codeService.getUserCode(userId);

    if (actualCode !== code) {
      throw ApiError.BadRequest("Incorrect code");
    }

    const userDto = new UserDto(user);
    const token = tokenService.generateToken({ ...userDto });

    return { user: userDto, token };
  }

  async login(email: string, password: string) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("No user with this email found");
    }

    const isPasswordsEqual = bcrypt.compareSync(password, user.password);
    if (!isPasswordsEqual) {
      throw ApiError.BadRequest("Wrong password");
    }

    const userId = String(user.id);

    return userId;
  }

  async getUser(email: string) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = new UserDto(user);
    return userDto;
  }

  async logout(email: string, sessionId: string) {
    const user = await userModel.findOne({ email });

    await user.save();

    await sessionModel.deleteOne({ sessionId });
  }

  async update(
    email: string,
    password: string,
    name: string,
    lastName: string
  ) {
    const user = await userModel.findOne({ email });

    if (password) {
      const hashPassword = bcrypt.hashSync(password, 3);
      user.password = hashPassword;
    }

    user.name = name;
    user.lastName = lastName;

    await user.save();

    const userDto = new UserDto(user);
    return userDto;
  }
}

export const userService = new UserService();
