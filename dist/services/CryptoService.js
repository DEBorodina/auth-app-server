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
exports.cryptoService = void 0;
const node_rsa_1 = __importDefault(require("node-rsa"));
const Session_1 = require("../models/Session");
const uuid_1 = require("uuid");
const aes_1 = __importDefault(require("crypto-js/aes"));
const crypto_js_1 = __importDefault(require("crypto-js"));
class CryptoService {
    generateKeyPair() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = new node_rsa_1.default({ b: 512 });
            key.generateKeyPair();
            //@ts-ignore
            const publicKey = key.exportKey("pkcs1-public-pem");
            const privateKey = key.exportKey("pkcs1-private-pem");
            const sessionId = (0, uuid_1.v4)();
            yield Session_1.sessionModel.create({ privateKey, sessionId });
            return { publicKey, sessionId };
        });
    }
    getSecretKey(sessionId, secretKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = new node_rsa_1.default({ b: 512 });
            const { privateKey } = yield Session_1.sessionModel.findOne({ sessionId });
            key.importKey(privateKey, "pkcs1-private-pem");
            const secret = key.decrypt(secretKey, "utf8");
            const session = yield Session_1.sessionModel.findOne({ sessionId });
            session.key = secret;
            session.save();
        });
    }
    decryptData(data, secretKey) {
        const bytes = aes_1.default.decrypt(data, secretKey);
        const dataJson = bytes.toString(crypto_js_1.default.enc.Utf8);
        return JSON.parse(dataJson);
    }
    encryptData(data, secretKey) {
        data = JSON.stringify(data);
        return aes_1.default.encrypt(data, secretKey).toString();
    }
}
exports.cryptoService = new CryptoService();
//# sourceMappingURL=CryptoService.js.map