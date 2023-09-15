import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from "dotenv";
import { codeService } from "./CodeService";

config();

class MailService {
  transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    } as SMTPTransport.Options);
  }

  async sendActivationMail(to: string, link: string) {
    await this.transporter.sendMail({
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
  }

  async sendVerifyCode(to: string) {
    const CODE_LENGTH = 4;
    const code = codeService.getRandomCode(CODE_LENGTH);
    await this.transporter.sendMail({
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
  }
}

export const mailService = new MailService();
