"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const MailService_1 = require("./MailService");
const TokenService_1 = require("./TokenService");
const UserDto_1 = require("../dtos/UserDto");
const ApiError_1 = require("../exceptions/ApiError");
const Session_1 = require("../models/Session");
class UserService {
    registration(email, password, name, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield User_1.userModel.findOne({ email });
            if (candidate && candidate.isActivated) {
                throw ApiError_1.ApiError.BadRequest("Email already in use");
            }
            yield User_1.userModel.deleteOne({ email });
            const hashPassword = bcrypt_1.default.hashSync(password, 3);
            const activationLink = (0, uuid_1.v4)();
            const user = yield User_1.userModel.create({
                email,
                password: hashPassword,
                activationLink,
                name,
                lastName,
                isCodeVerified: true,
            });
            const fullActivationLink = `${process.env.API_URL}/api/activate/${activationLink}`;
            yield MailService_1.mailService.sendActivationMail(email, fullActivationLink);
            const userDto = new UserDto_1.UserDto(user);
            const accessToken = TokenService_1.tokenService.generateToken(Object.assign({}, userDto));
            return accessToken;
        });
    }
    verifyUserWithCode(code, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findOne({ email });
            if (+code !== user.code) {
                throw ApiError_1.ApiError.BadRequest("Incorrect code");
            }
            user.isCodeVerified = true;
            yield user.save();
            const userDto = new UserDto_1.UserDto(user);
            return userDto;
        });
    }
    activate(activationLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findOne({ activationLink });
            if (!user) {
                throw ApiError_1.ApiError.BadRequest("Incorrect activation link");
            }
            user.isActivated = true;
            yield user.save();
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findOne({ email });
            if (!user) {
                throw ApiError_1.ApiError.BadRequest("No user with this email found");
            }
            if (!user.isActivated) {
                throw ApiError_1.ApiError.BadRequest("No user with this email found");
            }
            const isPasswordsEqual = bcrypt_1.default.compareSync(password, user.password);
            if (!isPasswordsEqual) {
                throw ApiError_1.ApiError.BadRequest("Wrong password");
            }
            const userDto = new UserDto_1.UserDto(user);
            const accessToken = TokenService_1.tokenService.generateToken(Object.assign({}, userDto));
            const code = yield MailService_1.mailService.sendVerifyCode(email);
            user.code = code;
            yield user.save();
            return accessToken;
        });
    }
    getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findOne({ email });
            if (!user || !user.isActivated || !user.isCodeVerified) {
                throw ApiError_1.ApiError.UnauthorizedError();
            }
            const userDto = new UserDto_1.UserDto(user);
            return userDto;
        });
    }
    logout(email, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findOne({ email });
            user.isCodeVerified = false;
            user.code = null;
            yield user.save();
            yield Session_1.sessionModel.deleteOne({ sessionId });
        });
    }
    update(email, password, name, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.userModel.findOne({ email });
            if (password) {
                const hashPassword = bcrypt_1.default.hashSync(password, 3);
                user.password = hashPassword;
            }
            user.name = name;
            user.lastName = lastName;
            yield user.save();
            const userDto = new UserDto_1.UserDto(user);
            return userDto;
        });
    }
}
exports.userService = new UserService();
//# sourceMappingURL=UserService.js.map