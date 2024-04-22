import { Request, Response, NextFunction } from "express"
import ServerConfig from "~/config/ServerConfig"
import { Middleware, IRequest } from "~/infrastructure/internal/types"
import { BooleanUtil } from "~/utils/BooleanUtil"
import { TypeParser } from "~/utils/TypeParser"

const ROUTE_WHITE_LIST = [
  `${ServerConfig.Server.Root}/ping`,
  `${ServerConfig.Server.Root}/v1/auth/login`,
]

class RouteWhiteListMiddleware {
  handle: Middleware = (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    TypeParser.cast<IRequest>(req).isWhiteList = false

    const existsUnauthorizedPath = ROUTE_WHITE_LIST.some((path) =>
      BooleanUtil.areEqual(path, req.path)
    )

    if (existsUnauthorizedPath) {
      TypeParser.cast<IRequest>(req).isWhiteList = true
    }

    return next()
  }
}

export default new RouteWhiteListMiddleware()
