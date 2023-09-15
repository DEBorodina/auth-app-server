import { userModel } from "../models/User";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { mailService } from "./MailService";
import { tokenService } from "./TokenService";
import { UserDto } from "../dtos/UserDto";
import { ApiError } from "../exceptions/ApiError";
import { sessionModel } from "../models/Session";

class UserService {
  async registration(
    email: string,
    password: string,
    name: string,
    lastName: string
  ) {
    const candidate = await userModel.findOne({ email });

    if (candidate && candidate.isActivated) {
      throw ApiError.BadRequest("Email already in use");
    }

    await userModel.deleteOne({ email });

    const hashPassword = bcrypt.hashSync(password, 3);
    const activationLink = v4();

    const user = await userModel.create({
      email,
      password: hashPassword,
      activationLink,
      name,
      lastName,
      isCodeVerified: true,
    });

    const fullActivationLink = `${process.env.API_URL}/api/activate/${activationLink}`;
    await mailService.sendActivationMail(email, fullActivationLink);

    const userDto = new UserDto(user);
    const accessToken = tokenService.generateToken({ ...userDto });

    return accessToken;
  }

  async verifyUserWithCode(code: number, email: string) {
    const user = await userModel.findOne({ email });

    if (+code !== user.code) {
      throw ApiError.BadRequest("Incorrect code");
    }

    user.isCodeVerified = true;
    await user.save();
    const userDto = new UserDto(user);

    return userDto;
  }

  async activate(activationLink: string) {
    const user = await userModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link");
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email: string, password: string) {
    const user = await userModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("No user with this email found");
    }

    if (!user.isActivated) {
      throw ApiError.BadRequest("No user with this email found");
    }

    const isPasswordsEqual = bcrypt.compareSync(password, user.password);
    if (!isPasswordsEqual) {
      throw ApiError.BadRequest("Wrong password");
    }

    const userDto = new UserDto(user);
    const accessToken = tokenService.generateToken({ ...userDto });

    const code = await mailService.sendVerifyCode(email);

    user.code = code;
    await user.save();

    return accessToken;
  }

  async getUser(email: string) {
    const user = await userModel.findOne({ email });

    if (!user || !user.isActivated || !user.isCodeVerified) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = new UserDto(user);
    return userDto;
  }

  async logout(email: string, sessionId: string) {
    const user = await userModel.findOne({ email });

    user.isCodeVerified = false;
    user.code = null;

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
