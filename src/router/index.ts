import { Router } from "express";
import { userController } from "../controllers/UserController";
import { body } from "express-validator";
import { userMiddleware } from "../middlewares/UserMiddleware";
import { cryptoController } from "../controllers/CryptoController";
import { cryptoMiddleware } from "../middlewares/CryptoMiddleware";
import { fileController } from "../controllers/FileController";

const router = Router();

router.post(
  "/registration",
  body("email"),
  body("password").isLength({ min: 8 }),
  body("name"),
  body("lastName"),
  cryptoMiddleware,
  userController.registration
);
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  cryptoMiddleware,
  userController.login
);
router.get("/files", userMiddleware, cryptoMiddleware, fileController.getFiles);
router.get("/publicKey", cryptoController.generateKeyPair);
router.post(
  "/secretKey",
  body("sessionId"),
  body("secretKey"),
  cryptoController.getSecretKey
);
router.post(
  "/verify-code",
  body("code").isLength({ min: 10, max: 10 }),
  body("userId"),
  cryptoMiddleware,
  userController.verifyCode
);
router.post(
  "/update",
  body("user"),
  cryptoMiddleware,
  userMiddleware,
  userController.update
);
router.post(
  "/files",
  body("file"),
  cryptoMiddleware,
  userMiddleware,
  fileController.addFile
);
router.get("/files", userMiddleware, cryptoMiddleware, fileController.getFiles);
router.get("/user", userMiddleware, cryptoMiddleware, userController.getUser);
router.get("/logout", userMiddleware, cryptoMiddleware, userController.logout);

export { router };
