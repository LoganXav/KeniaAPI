import { Request, Response, NextFunction } from "express"
import { ROUTE_PROTECTED, ROUTE_WHITE_LIST } from "~/config/RoutesConfig"
import { Middleware, IRequest } from "~/infrastructure/internal/types"
import { BooleanUtil } from "~/utils/BooleanUtil"
import { TypeParser } from "~/utils/TypeParser"

class RouteWhiteListMiddleware {
  public handle: Middleware = (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    TypeParser.cast<IRequest>(req).isWhiteList = false
    TypeParser.cast<IRequest>(req).isProtected = false
    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((path) =>
      BooleanUtil.areEqual(path, req.path)
    )
    const existsProtectedPath = ROUTE_PROTECTED.some((path) =>
      BooleanUtil.areEqual(path, req.path)
    )
    if (existsUnauthorizedPath) {
      TypeParser.cast<IRequest>(req).isWhiteList = true
    }
    if (existsProtectedPath) {
      TypeParser.cast<IRequest>(req).isProtected = true
    }
    return next()
  }
}

export default new RouteWhiteListMiddleware()
