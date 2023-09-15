"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../exceptions/ApiError");
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    if (err instanceof ApiError_1.ApiError) {
        const { status, message, errors } = err;
        res.status(status).json({ message, errors });
    }
    res.status(500).json({ message: "Unexpected error" });
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=ErrorMiddleware.js.map