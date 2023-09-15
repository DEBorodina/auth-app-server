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
exports.mailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
const CodeService_1 = require("./CodeService");
(0, dotenv_1.config)();
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    sendActivationMail(to, link) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transporter.sendMail({
                from: {
                    name: "Auth app",
                    address: "auth.app.node@gamil.com",
                },
                to,
                subject: "Активация аккаунта",
                text: "",
                html: `
          <div>
            <h1>Для активации перейдите <a href="${link}">по ссылке</a></h1>
          </div>
      `,
            });
        });
    }
    sendVerifyCode(to) {
        return __awaiter(this, void 0, void 0, function* () {
            const CODE_LENGTH = 4;
            const code = CodeService_1.codeService.getRandomCode(CODE_LENGTH);
            yield this.transporter.sendMail({
                from: {
                    name: "Auth app",
                    address: "auth.app.node@gamil.com",
                },
                to,
                subject: "Вход в аккаунт",
                text: "",
                html: `
          <div>
            <h1>Ваш код: ${code}</h1>
          </div>
      `,
            });
            return code;
        });
    }
}
exports.mailService = new MailService();
//# sourceMappingURL=MailService.js.map