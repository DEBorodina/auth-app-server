"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionModel = void 0;
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    privateKey: { type: String, required: true },
    sessionId: { type: String, required: true, unique: true },
    key: { type: String },
});
exports.sessionModel = (0, mongoose_1.model)("SessionModel", sessionSchema);
//# sourceMappingURL=Session.js.map