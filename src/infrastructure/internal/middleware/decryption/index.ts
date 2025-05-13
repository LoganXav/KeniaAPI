import { BooleanUtil } from "~/utils/BooleanUtil";
import { SKIP_DECRYPTION } from "~/config/RoutesConfig";
import { Request, Response, NextFunction } from "express";
import ServerConfig, { DEV } from "~/config/ServerConfig";
import { Middleware } from "~/infrastructure/internal/types";
import { PayloadEncryptService } from "~/api/shared/services/encryption/PayloadEncryptService";

class DecryptionMiddleware {
  public handle: Middleware = (req: Request, _res: Response, next: NextFunction): void => {
    const skipDecryption = SKIP_DECRYPTION.some((path) => BooleanUtil.areEqual(path, req.path));

    if (ServerConfig.Environment !== DEV && !skipDecryption) {
      const decryptedRequestBody = PayloadEncryptService.decrypt(req.body.request);

      req.body = decryptedRequestBody;

      delete req.body.request;
    }
    return next();
  };
}

export default new DecryptionMiddleware();
