import { Request, Response, NextFunction } from "express";
import { Middleware } from "~/infrastructure/internal/types";
import { PayloadEncryptService } from "~/api/shared/services/encryption/PayloadEncryptService";
import ServerConfig, { DEV } from "~/config/ServerConfig";

class DecryptionMiddleware {
  public handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    if (ServerConfig.Environment !== DEV) {
      const decryptedRequestBody = PayloadEncryptService.decrypt(req.body.request);

      req.body = decryptedRequestBody;

      delete req.body.request;
    }
    return next();
  };
}

export default new DecryptionMiddleware();
