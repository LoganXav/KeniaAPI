import "express-async-errors"
import express, {
  Application,
  Router,
  Express as Server,
  Request,
  Response,
  NextFunction,
} from "express"
import bodyParser from "body-parser"
import helmet from "helmet"
import cors from "cors"
import { sync } from "fast-glob"
import { resolve } from "path"
import clientInfoMiddleware from "../middleware/clientInfo"
import routeWhiteListMiddleware from "../middleware/authorization/whiteList"
import { DbContext } from "~/infrastructure/internal/database"
import { LoggingProviderFactory } from "../logger/LoggingProviderFactory"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { MIDDLEWARE_ATTACHED } from "~/api/shared/helpers/messages/SystemMessages"
import { errorHandler } from "../exceptions/ErrorHandler"
import ServerConfig from "~/config/ServerConfig"
import { TypeParser } from "~/utils/TypeParser"
import { IRouter } from "../types"
import AppSettings from "~/api/shared/setttings/AppSettings"

export default class Express {
  app: Server
  dbContext: DbContext
  loggingProvider: ILoggingDriver

  constructor(dbContext: DbContext) {
    this.app = express()
    this.dbContext = dbContext
    this.loggingProvider = LoggingProviderFactory.build()
    this.app.set("trust proxy", true)
    this.loadMiddlewares()
    this.loadErrorHandler()
  }

  // TODO -- connect db

  private loadMiddlewares(): void {
    this.app
      .use(helmet())
      .use(bodyParser.urlencoded({ extended: true }))
      .use(express.json())
      .use(cors())
      .use(clientInfoMiddleware.handle)
      .use(routeWhiteListMiddleware.handle)
    // TODO -- add more middlewares

    this.loggingProvider.info(MIDDLEWARE_ATTACHED)
  }

  private async loadControllersDynamically(): Promise<void> {
    const controllerPaths = ServerConfig.Server.ServiceContext.LoadWithContext
      ? ServerConfig.Controllers.ContextPaths.map((serviceContext) => {
          return sync(serviceContext, {
            onlyFiles: true,
            ignore: ServerConfig.Controllers.Ignore,
          })
        }).flat()
      : sync(ServerConfig.Controllers.DefaultPath, {
          onlyFiles: true,
          ignore: ServerConfig.Controllers.Ignore,
        })

    for (const filePath of controllerPaths) {
      const controllerPath = resolve(filePath)

      const { default: controller } = await import(controllerPath)
      // TODO -- Set Api Doc Generator to controllers
      this.loggingProvider.info(
        `Initializing controllers for ${AppSettings.ServiceContext.toUpperCase()} ServiceContext`
      )

      // TODO -- Refactor Base controller (1. Remove result methods fro base controller 2. Let each controller handle their return logic)
      controller.initializeRoutes(TypeParser.cast<IRouter>(Router))
      this.app.use(
        AppSettings.ServerRoot,
        TypeParser.cast<Application>(controller.router)
      )
      this.loggingProvider.info(
        `${controller?.constructor?.name} was initialized`
      )
    }
    return Promise.resolve()
  }

  initializeServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadControllersDynamically()
        .then(() => {
          // Initialize database service and other services here.
          // reject if any error with database or other service.
          return resolve()
        })
        .catch((error) => {
          return reject(error)
        })
    })
  }

  private loadErrorHandler(): void {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(err)
        this.loggingProvider.error(err.message)
        next(err)
      }
    )

    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.handleError(err, res)
      }
    )
  }
}
