import { sign, verify } from "jsonwebtoken";
import AppSettings, { AppConstants } from "../../setttings/AppSettings";
import { User } from "@prisma/client";
import { UnauthenticatedError } from "~/infrastructure/internal/exceptions/UnauthenticatedError";

type JwtPayload = {
  id: string;
  email: string;
};

export class JwtService {
  public static getJwt(user: User): Promise<string> {
    const token = sign(
      {
        identifier: user.id,
        email: user.email,
      },
      AppSettings.JWTEncryptionKey,
      {
        algorithm: AppConstants.HS512_ALGORITHM,
        expiresIn: AppSettings.JWTExpirationTime,
      }
    );

    return Promise.resolve(token);
  }

  public static verifyJwt(token: string): JwtPayload {
    try {
      return verify(token, AppSettings.JWTEncryptionKey, {
        algorithms: [AppConstants.HS512_ALGORITHM],
      }) as JwtPayload;
    } catch (error) {
      console.log(error);
      throw new UnauthenticatedError();
    }
  }
}
