"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, message, errors = []) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
    static UnauthorizedError() {
        return new ApiError(401, "Not authorized");
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map