import { Router } from "express";
import { userController } from "../controllers/UserController";
import { body } from "express-validator";
import { userMiddleware } from "../middlewares/UserMiddleware";
import { cryptoController } from "../controllers/CryptoController";
import { cryptoMiddleware } from "../middlewares/CryptoMiddleware";

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
router.get("/publicKey", cryptoController.generateKeyPair);
router.post(
  "/secretKey",
  body("sessionId"),
  body("secretKey"),
  cryptoController.getSecretKey
);
router.post(
  "/verify-code",
  body("code").isLength({ min: 4, max: 4 }),
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
router.get("/user", userMiddleware, cryptoMiddleware, userController.getUser);
router.get("/logout", userMiddleware, cryptoMiddleware, userController.logout);
router.get("/activate/:link", userController.activate);

export { router };
