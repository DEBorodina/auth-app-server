import { createServer } from "node:http";
import staticHandler from "serve-handler";
import ws, { WebSocketServer } from "ws";
import { cryptoService } from "../services/CryptoService";
import { ApiError } from "../exceptions/ApiError";
import { sessionModel } from "../models/Session";
import { messageService } from "../services/MessageService";

export const startWebSocketService = () => {
  const server = createServer((req, res) => {
    return staticHandler(req, res, { public: "public" });
  });

  const wss = new WebSocketServer({ server });

  wss.on("connection", (client: ws & { key: string }) => {
    console.log("Client connected !");

    client.on("message", async (message: Buffer) => {
      const messageString = Buffer.from(message).toString();
      const { sessionId, data } = JSON.parse(messageString);
      if (!sessionId) {
        ApiError.BadRequest("Session id required");
      }

      const { key } = await sessionModel.findOne({ sessionId });

      if (!client.key) {
        client.key = key;
      }
      if (data) {
        const decryptedMessage = cryptoService.decryptData(data, key);
        await messageService.addMessage(decryptedMessage);
        await broadcast();
      }
    });
  });

  async function broadcast() {
    for (const client of wss.clients) {
      const { key } = client as ws & { key: string };
      const messages = await messageService.getMessages();
      if (client.readyState === ws.OPEN) {
        client.send(cryptoService.encryptData(messages, key));
      }
    }
  }
  server.listen(5001, () => {
    console.log(`server listening...`);
  });
};
