import { codeModel } from "../models/Code";
import { cryptoService } from "./CryptoService";

const CODE_LENGTH = 10;

class CodeService {
  getRandomCode(length: number) {
    let min = 10 ** (length - 1);
    let max = 10 ** length;
    min = Math.ceil(min);
    max = Math.floor(max);
    return String(Math.floor(Math.random() * (max - min)) + min);
  }

  async generateCodeForUser(userId: string) {
    const code = this.getRandomCode(CODE_LENGTH);

    let firstCodePart = code.slice(0, 5);
    let secondCodePart = code.slice(5);

    const firstAesKey = process.env.CODE_PART_1_AES_KEY;
    const secondAesKey = process.env.CODE_PART_2_AES_KEY;

    firstCodePart = cryptoService.encryptData(firstCodePart, firstAesKey);
    secondCodePart = cryptoService.encryptData(secondCodePart, secondAesKey);

    await codeModel.create({ userId, part: 0, code: firstCodePart });
    await codeModel.create({ userId, part: 1, code: secondCodePart });

    return code;
  }

  async getUserCode(userId: string) {
    const codes = await codeModel.find({ userId });

    let { code: firstCodePart } = codes.find(({ part }) => part == 0);
    let { code: secondCodePart } = codes.find(({ part }) => part == 1);

    const firstAesKey = process.env.CODE_PART_1_AES_KEY;
    const secondAesKey = process.env.CODE_PART_2_AES_KEY;

    firstCodePart = cryptoService.decryptData(firstCodePart, firstAesKey);
    secondCodePart = cryptoService.decryptData(secondCodePart, secondAesKey);

    return firstCodePart + secondCodePart;
  }
}

export const codeService = new CodeService();
