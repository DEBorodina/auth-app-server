import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./router";
import { errorMiddleware } from "./middlewares/ErrorMiddleware";
import { startWebSocketService } from "./websockets";

startWebSocketService();
const app = express();

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
