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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const UserService_1 = require("../services/UserService");
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../exceptions/ApiError");
const TokenService_1 = require("../services/TokenService");
const CryptoService_1 = require("../services/CryptoService");
class UserController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return next(ApiError_1.ApiError.BadRequest("Validation error", errors.array()));
                }
                const key = req.key;
                let { email, password, name, lastName } = yield req.body;
                email = CryptoService_1.cryptoService.decryptData(email, key);
                password = CryptoService_1.cryptoService.decryptData(password, key);
                name = CryptoService_1.cryptoService.decryptData(name, key);
                lastName = CryptoService_1.cryptoService.decryptData(lastName, key);
                const token = yield UserService_1.userService.registration(email, password, name, lastName);
                return res.json(CryptoService_1.cryptoService.encryptData(token, key));
            }
            catch (e) {
                next(e);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = yield req.body;
                const key = req.key;
                email = CryptoService_1.cryptoService.decryptData(email, key);
                password = CryptoService_1.cryptoService.decryptData(password, key);
                const token = yield UserService_1.userService.login(email, password);
                return res.json(CryptoService_1.cryptoService.encryptData(token, key));
            }
            catch (e) {
                next(e);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, sessionId } = req.user;
                yield UserService_1.userService.logout(email, sessionId);
                return res.json();
            }
            catch (e) {
                next(e);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password, name, lastName } = req.body;
                const key = req.key;
                password = CryptoService_1.cryptoService.decryptData(password, key);
                name = CryptoService_1.cryptoService.decryptData(name, key);
                lastName = CryptoService_1.cryptoService.decryptData(lastName, key);
                const authorizationHeader = req.headers.authorization;
                const accessToken = authorizationHeader.split(" ")[1];
                const { email } = TokenService_1.tokenService.validateToken(accessToken);
                const user = (yield UserService_1.userService.update(email, password, name, lastName));
                for (const field in user) {
                    user[field] = CryptoService_1.cryptoService.encryptData(user[field], key);
                }
                return res.json(user);
            }
            catch (e) {
                next(e);
            }
        });
    }
    activate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activationLink = req.params.link;
                yield UserService_1.userService.activate(activationLink);
                return res.redirect(process.env.CLIENT_URL);
            }
            catch (e) {
                next(e);
            }
        });
    }
    verifyCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { code } = req.body;
                const key = req.key;
                code = CryptoService_1.cryptoService.decryptData(code, key);
                const authorizationHeader = req.headers.authorization;
                const accessToken = authorizationHeader.split(" ")[1];
                const { email } = TokenService_1.tokenService.validateToken(accessToken);
                const user = (yield UserService_1.userService.verifyUserWithCode(code, email));
                for (const field in user) {
                    user[field] = CryptoService_1.cryptoService.encryptData(user[field], key);
                }
                return res.json(user);
            }
            catch (e) {
                next(e);
            }
        });
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.user;
                const key = req.key;
                const user = (yield UserService_1.userService.getUser(email));
                for (const field in user) {
                    user[field] = CryptoService_1.cryptoService.encryptData(user[field], key);
                }
                return res.json(user);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.userController = new UserController();
//# sourceMappingURL=UserController.js.map