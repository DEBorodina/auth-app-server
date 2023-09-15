import jwtToken, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../models/User";

class TokenService {
  generateToken(payload: object) {
    const accessToken = jwtToken.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "24h",
    });

    return accessToken;
  }

  validateToken(token: string) {
    try {
      const userData = jwtToken.verify(
        token,
        process.env.JWT_ACCESS_SECRET
      ) as JwtPayload & IUser;

      return userData;
    } catch (e) {
      console.log(e);

      return null;
    }
  }
}

export const tokenService = new TokenService();
