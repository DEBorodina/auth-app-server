import NodeRSA from "node-rsa";
import { sessionModel } from "../models/Session";
import { v4 } from "uuid";
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";

class CryptoService {
  async generateKeyPair() {
    const key = new NodeRSA({ b: 512 });
    key.generateKeyPair();
    //@ts-ignore
    const publicKey = key.exportKey("pkcs1-public-pem");
    const privateKey = key.exportKey("pkcs1-private-pem");

    const sessionId = v4();

    await sessionModel.create({ privateKey, sessionId });

    return { publicKey, sessionId };
  }

  async getSecretKey(sessionId: string, secretKey: any) {
    const key = new NodeRSA({ b: 512 });

    const { privateKey } = await sessionModel.findOne({ sessionId });

    key.importKey(privateKey, "pkcs1-private-pem");

    const secret = key.decrypt(secretKey, "utf8");

    const session = await sessionModel.findOne({ sessionId });
    session.key = secret;

    session.save();
  }

  decryptData(data: string, secretKey: string) {
    const bytes = AES.decrypt(data, secretKey);
    const dataJson = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(dataJson);
  }

  encryptData(data: any, secretKey: string) {
    data = JSON.stringify(data);

    return AES.encrypt(data, secretKey).toString();
  }
}

export const cryptoService = new CryptoService();
