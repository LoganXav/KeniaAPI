import { Response, Request, NextFunction } from "express"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import {
  AUTHORIZATION_REQUIRED,
  ERROR_INVALID_TOKEN,
  ERROR_MISSING_TOKEN,
} from "~/api/shared/helpers/messages/SystemMessages"
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError"
import { IRequest, ISession, Middleware } from "~/infrastructure/internal/types"
import ArrayUtil from "~/utils/ArrayUtil"
// import { TryWrapper } from "~/utils/TryWrapper"
import { TypeParser } from "~/utils/TypeParser"

const TOKEN_PARTS = 2
const TOKEN_POSITION_VALUE = 1

class AuthorizationMiddleware {
  public handle: Middleware = (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (TypeParser.cast<IRequest>(req).isWhiteList) return next()

    if (!TypeParser.cast<IRequest>(req).isProtected) return next()

    const auth = req.headers.authorization

    if (!auth) return next(this.getUnauthorized(ERROR_MISSING_TOKEN))

    const jwtParts = ArrayUtil.allOrDefault(auth.split(/\s+/))
    if (jwtParts.length !== TOKEN_PARTS)
      return next(this.getUnauthorized(ERROR_INVALID_TOKEN))

    const token = ArrayUtil.getWithIndex(jwtParts, TOKEN_POSITION_VALUE)

    // TODO - Add an Auth Provider to verify tokens
    // const sessionResult = TryWrapper.exec(AuthProvider.verifyJwt, [token])
    // if (!sessionResult.success)
    //   return next(this.getUnauthorized(ERROR_EXPIRED_TOKEN))

    // TypeParser.cast<IRequest>(req).session = TypeParser.cast<ISession>(
    //   sessionResult.value
    // )

    return next()
  }

  // REFACTOR -- Create different exception types.
  private getUnauthorized(message: string): ApplicationError {
    return new ApplicationError({
      httpStatusCode: HttpStatusCodeEnum.UNAUTHORIZED,
      description: message,
      isOperational: true,
    })
  }
}

export default new AuthorizationMiddleware()
