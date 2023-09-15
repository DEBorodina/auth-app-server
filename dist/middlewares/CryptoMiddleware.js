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
exports.cryptoMiddleware = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const Session_1 = require("../models/Session");
const cryptoMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = req.headers["x-session-id"];
        if (!sessionId) {
            return next(ApiError_1.ApiError.BadRequest("Session id required"));
        }
        const { key } = yield Session_1.sessionModel.findOne({ sessionId });
        req.key = key;
        req.body.sessionId = sessionId;
        next();
    }
    catch (e) {
        console.log(e);
        return next(ApiError_1.ApiError.UnauthorizedError());
    }
});
exports.cryptoMiddleware = cryptoMiddleware;
//# sourceMappingURL=CryptoMiddleware.js.map