import "express-async-errors";
import express, { Application, Router, Express as Server, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import { sync } from "fast-glob";
import { resolve } from "path";
import clientInfoMiddleware from "../middleware/clientInfo";
import routeWhiteListMiddleware from "../middleware/authorization/whiteList";
import authorizationMiddleware from "../middleware/authorization/jwt";
import serviceTraceMiddleware from "../middleware/trace";
import { LoggingProviderFactory } from "../logger/LoggingProviderFactory";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
// import { MIDDLEWARES_ATTACHED } from "~/api/shared/helpers/messages/SystemMessages";
import { errorHandler } from "../exceptions/ErrorHandler";
import ServerConfig from "~/config/ServerConfig";
import { TypeParser } from "~/utils/TypeParser";
import { IRouter } from "../types";
import AppSettings from "~/api/shared/setttings/AppSettings";
import { container } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { ApiDocGenerator } from "~/infrastructure/internal/documentation/ApiDocGenerator";
import { serve, setup } from "swagger-ui-express";

export default class Express {
  app: Server;
  loggingProvider: ILoggingDriver;
  apiDocGenerator: ApiDocGenerator;

  constructor() {
    this.app = express();
    this.loggingProvider = LoggingProviderFactory.build();
    this.apiDocGenerator = new ApiDocGenerator(ServerConfig.Environment, ServerConfig.ApiDocsInfo);
    this.loadMiddlewares();
    this.loadErrorHandler();
  }

  private loadMiddlewares(): void {
    const options: cors.CorsOptions = {
      origin: ServerConfig.Server.Origins.split(","),
    };

    this.app
      .use(helmet())
      .use(express.json())
      .use(express.urlencoded({ extended: true }))
      .use(cors(options))
      .use(clientInfoMiddleware.handle)
      .use(routeWhiteListMiddleware.handle)
      .use(authorizationMiddleware.handle)
      .use(serviceTraceMiddleware.handle);

    // this.loggingProvider.info(MIDDLEWARES_ATTACHED);
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

    // this.loggingProvider.info(`Initializing controllers for ${AppSettings.ServiceContext.toUpperCase()}`);

    for (const filePath of controllerPaths) {
      const controllerPath = resolve(filePath);

      const { default: controller } = await import(controllerPath);
      const resolvedController: BaseController = container.resolve(controller);
      // TODO -- Set Api Doc Generator to controllers
      resolvedController.initializeRoutes(TypeParser.cast<IRouter>(Router));
      this.app.use(AppSettings.ServerRoot, TypeParser.cast<Application>(resolvedController.router));
      // this.loggingProvider.info(`${resolvedController?.controllerName} was initialized`);
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
    this.app.use(`${AppSettings.ServerRoot}/docs`, serve, setup(this.apiDocGenerator.apiDoc));
    // .use(TypeParser.cast<RequestHandler>(statusController.resourceNotFound));
  }

  private loadErrorHandler(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.loggingProvider.error(err.message);
      next(err);
    });

    this.app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        errorHandler.handleError(err, res);
      }
    );
  }
}
