import { Response, Request, NextFunction } from "express"
import TokenProvider from "~/api/modules/auth/providers/auth/Token.provider"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import {
  AUTHORIZATION_REQUIRED,
  ERROR_EXPIRED_TOKEN,
  ERROR_INVALID_TOKEN,
  ERROR_MISSING_TOKEN
} from "~/api/shared/helpers/messages/SystemMessages"
import { JwtService } from "~/api/shared/services/jwt/Jwt.service"
import ApplicationError from "~/infrastructure/internal/exceptions/ApplicationError"
import { IRequest, ISession, Middleware } from "~/infrastructure/internal/types"
import ArrayUtil from "~/utils/ArrayUtil"
import { TryWrapper } from "~/utils/TryWrapper"
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

    const auth = req.headers.authorization

    if (!auth) return next(this.getUnauthorized(ERROR_MISSING_TOKEN))

    const jwtParts = ArrayUtil.allOrDefault(auth.split(/\s+/))
    if (jwtParts.length !== TOKEN_PARTS)
      return next(this.getUnauthorized(ERROR_INVALID_TOKEN))

    const token = ArrayUtil.getWithIndex(jwtParts, TOKEN_POSITION_VALUE)

    // TODO - Add an Auth Provider to verify session
    const tokenValidation = TryWrapper.exec(JwtService.verifyJwt, [token])
    if (!tokenValidation.success)
      return next(this.getUnauthorized(ERROR_EXPIRED_TOKEN))

    TypeParser.cast<IRequest>(req).session = TypeParser.cast<ISession>(
      tokenValidation.value
    )

    return next()
  }

  // REFACTOR -- Create different exception types.
  private getUnauthorized(message: string): ApplicationError {
    return new ApplicationError({
      httpStatusCode: HttpStatusCodeEnum.UNAUTHORIZED,
      description: message,
      isOperational: true
    })
  }
}

export default new AuthorizationMiddleware()
