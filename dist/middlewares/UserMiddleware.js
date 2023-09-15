"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const TokenService_1 = require("../services/TokenService");
const userMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError_1.ApiError.UnauthorizedError());
        }
        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError_1.ApiError.UnauthorizedError());
        }
        const userData = TokenService_1.tokenService.validateToken(accessToken);
        if (!userData) {
            return next(ApiError_1.ApiError.UnauthorizedError());
        }
        req.user = userData;
        next();
    }
    catch (e) {
        return next(ApiError_1.ApiError.UnauthorizedError());
    }
};
exports.userMiddleware = userMiddleware;
//# sourceMappingURL=UserMiddleware.js.map