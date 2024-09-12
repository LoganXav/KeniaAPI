import CryptoJS from "crypto-js";
import ServerConfig from "~/config/ServerConfig";
import { Request, Response, NextFunction } from "express";
import { Middleware } from "~/infrastructure/internal/types";

const KEY = CryptoJS.enc.Hex.parse(ServerConfig.Params.Security.Decrypt.Key);
const IV = CryptoJS.enc.Hex.parse(ServerConfig.Params.Security.Decrypt.Iv);

class DecryptionMiddleware {
  public handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    const decrypted = CryptoJS.AES.decrypt(req.body.request, KEY, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: IV,
    });

    // Convert decrypted WordArray to UTF-8 string
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    // Parse the decrypted text as JSON
    const decryptedRequestBody = JSON.parse(decryptedText);

    // Optionally, replace the request body with the decrypted data
    req.body = decryptedRequestBody;

    delete req.body.request;

    return next();
  };
}

export default new DecryptionMiddleware();
