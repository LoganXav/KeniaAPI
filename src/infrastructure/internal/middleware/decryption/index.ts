import { Request, Response, NextFunction } from "express";
import { Middleware } from "~/infrastructure/internal/types";
import { PayloadEncryptService } from "~/api/shared/services/encryption/PayloadEncryptService";
import ServerConfig, { DEV } from "~/config/ServerConfig";
import { NOT_ENCRYPTED } from "~/config/RoutesConfig";
import { BooleanUtil } from "~/utils/BooleanUtil";

class DecryptionMiddleware {
  public handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    const skipDecryption = NOT_ENCRYPTED.some((path) => BooleanUtil.areEqual(path, req.path));

    if (ServerConfig.Environment !== DEV || !skipDecryption) {
      const decryptedRequestBody = PayloadEncryptService.decrypt(req.body.request);

      req.body = decryptedRequestBody;

      delete req.body.request;
    }
    return next();
  };
}

export default new DecryptionMiddleware();
