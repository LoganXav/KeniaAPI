import cors from "cors";
import helmet from "helmet";
import "express-async-errors";
import { resolve } from "path";
import { sync } from "fast-glob";
import { container } from "tsyringe";
import { TypeParser } from "~/utils/TypeParser";
import ServerConfig from "~/config/ServerConfig";
import { serve, setup } from "swagger-ui-express";
import { IRouter } from "~/infrastructure/internal/types";
import AppSettings from "~/api/shared/setttings/AppSettings";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import serviceTraceMiddleware from "~/infrastructure/internal/middleware/trace";
import { errorHandler } from "~/infrastructure/internal/exceptions/ErrorHandler";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import decryptionMiddleware from "~/infrastructure/internal/middleware/decryption";
import clientInfoMiddleware from "~/infrastructure/internal/middleware/clientInfo";
import { MIDDLEWARES_ATTACHED } from "~/api/shared/helpers/messages/SystemMessages";
import { ApiDocGenerator } from "~/infrastructure/internal/documentation/ApiDocGenerator";
import { UnauthorizedError } from "~/infrastructure/internal/exceptions/UnauthorizedError";
import authorizationMiddleware from "~/infrastructure/internal/middleware/authorization/jwt";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import routeWhiteListMiddleware from "~/infrastructure/internal/middleware/authorization/whiteList";
import express, { Application, Router, Express as Server, Request, Response, NextFunction } from "express";

export default class Express {
  app: Server;
  loggingProvider: ILoggingDriver;
  apiDocGenerator: ApiDocGenerator;

  constructor() {
    this.app = express();
    this.loggingProvider = LoggingProviderFactory.build();
    this.loadMiddlewares();
    this.apiDocGenerator = new ApiDocGenerator(ServerConfig.Environment, ServerConfig.ApiDocsInfo);
    this.loadErrorHandler();
  }

  private loadMiddlewares(): void {
    const options: cors.CorsOptions = {
      origin: (origin, callback) => {
        const allowedOrigins = ServerConfig.Server.Origins.split(",");
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new UnauthorizedError("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 200,
    };

    this.app
      .use(cors(options))
      .use(helmet())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(decryptionMiddleware.handle)
      .use(clientInfoMiddleware.handle)
      .use(routeWhiteListMiddleware.handle)
      .use(authorizationMiddleware.handle)
      .use(serviceTraceMiddleware.handle);

    this.loggingProvider.info(MIDDLEWARES_ATTACHED);
  }

  private async loadControllersDynamically(): Promise<void> {
    const controllerPaths = ServerConfig.Server.ServiceContext.LoadWithContext
      ? ServerConfig.Controllers.ContextPaths.map((serviceContext) => {
          return sync(serviceContext, {
            onlyFiles: true,
            ignore: ServerConfig.Controllers.Ignore,
          });
        }).flat()
      : sync(ServerConfig.Controllers.DefaultPath, {
          onlyFiles: true,
          ignore: ServerConfig.Controllers.Ignore,
        });

    this.loggingProvider.info(`Initializing controllers for ${AppSettings.ServiceName.toUpperCase()}`);

    for (const filePath of controllerPaths) {
      const controllerPath = resolve(filePath);

      const { default: controller } = await import(controllerPath);
      const resolvedController: BaseController = container.resolve(controller);
      resolvedController.setApiDocGenerator(this.apiDocGenerator);
      resolvedController.initializeRoutes(TypeParser.cast<IRouter>(Router));
      this.app.use(AppSettings.ServerRoot, TypeParser.cast<Application>(resolvedController.router));
      this.loggingProvider.info(`${resolvedController?.controllerName} was initialized`);
    }

    this.loadApiDocs();
    return Promise.resolve();
  }

  initializeServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadControllersDynamically()
        .then(async () => {
          // Initialize database service and other services here.
          // reject if any error with database or other service.
          return resolve();
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  private loadApiDocs(): void {
    this.app.use(`${ServerConfig.Server.Root}/docs`, serve, setup(this.apiDocGenerator.apiDoc));
    // TODO: Load a not found controller
    // .use(TypeParser.cast<RequestHandler>(statusController.resourceNotFound));
  }

  private loadErrorHandler(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.loggingProvider.error(err.message);
      next(err);
    });

    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorHandler.handleError(err, res);
    });
  }
}
