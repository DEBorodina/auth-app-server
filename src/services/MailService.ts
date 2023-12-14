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

  async sendVerifyCode(to: string, userId: string) {
    const code = await codeService.getUserCode(userId);

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
            <h1>Внимание: код будет отправлен только один раз без возможности восстановления!</h1>
            <h4>Ваш код: ${code}</h4>
          </div>
      `,
    });

    return code;
  }
}

export const mailService = new MailService();
