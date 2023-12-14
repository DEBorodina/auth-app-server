import { NextFunction, Request, Response } from "express";
import { userService } from "../services/UserService";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/ApiError";
import { tokenService } from "../services/TokenService";
import { cryptoService } from "../services/CryptoService";
import { fileService } from "../services/FileService";
import { UserDto } from "../dtos/UserDto";

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const key = req.key;
      let { email, password, name, lastName } = await req.body;

      email = cryptoService.decryptData(email, key);
      password = cryptoService.decryptData(password, key);
      name = cryptoService.decryptData(name, key);
      lastName = cryptoService.decryptData(lastName, key);

      const userId = await userService.registration(
        email,
        password,
        name,
        lastName
      );

      return res.json(cryptoService.encryptData(userId, key));
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      let { email, password } = await req.body;
      const key = req.key;

      email = cryptoService.decryptData(email, key);
      password = cryptoService.decryptData(password, key);

      const userId = await userService.login(email, password);

      return res.json(cryptoService.encryptData(userId, key));
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, sessionId } = req.user;
      await userService.logout(email, sessionId);
      return res.json();
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      let { password, name, lastName } = req.body;

      const key = req.key;
      password = cryptoService.decryptData(password, key);
      name = cryptoService.decryptData(name, key);
      lastName = cryptoService.decryptData(lastName, key);

      const authorizationHeader = req.headers.authorization;
      const accessToken = authorizationHeader.split(" ")[1];
      const { email } = tokenService.validateToken(accessToken);

      const user = (await userService.update(
        email,
        password,
        name,
        lastName
      )) as unknown as Record<string, string>;

      for (const field in user) {
        user[field] = cryptoService.encryptData(user[field], key);
      }

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async verifyCode(req: Request, res: Response, next: NextFunction) {
    try {
      let { code, userId } = req.body;
      const key = req.key;

      code = cryptoService.decryptData(code, key);
      userId = cryptoService.decryptData(userId, key);

      let { user, token } = await userService.verifyUserWithCode(code, userId);

      let field: keyof UserDto;
      for (field in user) {
        user[field] = cryptoService.encryptData(user[field], key) as any;
      }

      token = cryptoService.encryptData(token, key);

      return res.json({ user, token });
    } catch (e) {
      next(e);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.user;
      const key = req.key;
      const user = (await userService.getUser(email)) as unknown as Record<
        string,
        string
      >;

      for (const field in user) {
        user[field] = cryptoService.encryptData(user[field], key);
      }

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
