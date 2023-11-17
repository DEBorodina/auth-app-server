import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router";
import { errorMiddleware } from "./middlewares/ErrorMiddleware";
import { createServer } from "node:http";
import staticHandler from "serve-handler";
import ws, { WebSocketServer } from "ws";

const messages: string[] = [];

const app = express();

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: "public" });
});

const wss = new WebSocketServer({ server });
wss.on("connection", (client) => {
  console.log("Client connected !");
  client.on("message", (msg: string) => {
    messages.push(msg);
    console.log(`Message:${msg}`);
    broadcast(msg);
  });
});

function broadcast(msg: string) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(messages));
    }
  }
}
server.listen(5001, () => {
  console.log(`server listening...`);
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", router);
app.use(errorMiddleware);

config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => {
      console.log(`server running ` + PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
