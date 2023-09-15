"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    isCodeVerified: { type: Boolean, default: false },
    code: { type: Number, default: null },
});
exports.userModel = (0, mongoose_1.model)("UserModel", userSchema);
//# sourceMappingURL=User.js.map