import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceContext } from "~/api/shared/helpers/enums/ServiceContext.enum";
import { HeaderType, INextFunction, IResponse, IRouter } from "~/infrastructure/internal/types";
import statusMapping from "../helpers/StatusMapping";
import { RouteType } from "../types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { IApiDocGenerator } from "~/infrastructure/internal/documentation/IApiDocGenerator";
import { PayloadEncryptService } from "~/api/shared/services/encryption/PayloadEncryptService";

export default abstract class BaseController {
  controllerName: string;
  router?: IRouter;
  serviceContext: ServiceContext;
  apiDocGenerator?: IApiDocGenerator;
  loggingProvider: ILoggingDriver;
  constructor(serviceContext: ServiceContext = ServiceContext.KENIA_EXPRESS) {
    this.serviceContext = serviceContext;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public abstract initializeRoutes(router: IRouter): void;

  public setApiDocGenerator(apiDocGenerator: IApiDocGenerator): void {
    this.apiDocGenerator = apiDocGenerator;
  }

  public setRouter(router: IRouter): void {
    this.router = router;
  }

  public addRoute(route: RouteType): void {
    const { produces, method, handlers, path, description, apiDoc } = route;
    produces.forEach(({ applicationStatus, httpStatus }) => this.setProducesCode(applicationStatus, httpStatus));

    if (!this.router) {
      throw new Error("Router not initialized, you should call setRouter before addRoute.");
    }
    // Calls the routes with the path and handlers i.e controllers
    this.router[method](path, ...handlers);

    if (this.apiDocGenerator) {
      this.apiDocGenerator.createRouteDoc({
        method,
        path,
        produces,
        description,
        apiDoc,
      });
    }
  }

  public async handleResultData(res: IResponse, next: INextFunction, servicePromise: Promise<IResult>, headersToSet?: HeaderType): Promise<void> {
    try {
      return await this.getResultData(res, await servicePromise, headersToSet);
    } catch (error) {
      return next(error);
    } finally {
      this.manageServiceTrace(res.trace);
    }
  }

  public async handleResult(res: IResponse, next: INextFunction, servicePromise: Promise<IResult>, headersToSet?: HeaderType): Promise<void> {
    try {
      return await this.getResult(res, await servicePromise, headersToSet);
    } catch (error) {
      return next(error);
    } finally {
      this.manageServiceTrace(res.trace);
    }
  }

  // <===========+ Helper Methods +============> //

  private async getResultData(res: IResponse, result: IResult, headersToSet?: HeaderType): Promise<void> {
    this.setTransactionId(res);
    this.setHeaders(res, headersToSet);
    const encryptedResult = PayloadEncryptService.encrypt(result?.toResultDto());
    const encryptedResultWithoutMessage = PayloadEncryptService.encrypt(result?.toResultDto().data);

    res.status(Number(result.statusCode)).json(result.message ? encryptedResult : encryptedResultWithoutMessage);
  }

  private setHeaders(res: IResponse, headersToSet?: HeaderType): void {
    if (headersToSet) {
      Object.entries(headersToSet).forEach(([key, value]) => res.setHeader(key, value));
    }
  }

  private async getResult(res: IResponse, result: IResult, headersToSet?: HeaderType): Promise<void> {
    this.setTransactionId(res);
    this.setHeaders(res, headersToSet);
    res.status(Number(result.statusCode)).json(result);
  }

  private setProducesCode(applicationStatus: string, httpStatus: HttpStatusCodeEnum): void {
    if (!statusMapping[applicationStatus]) {
      statusMapping[applicationStatus] = httpStatus;
    }
  }

  private setTransactionId(res: IResponse): void {
    res.setHeader(HttpHeaderEnum.TRANSACTION_ID, res.trace.transactionId);
  }

  private async manageServiceTrace(trace: ServiceTrace): Promise<void> {
    if (trace?.context) {
      trace.finish(new Date());
      try {
        const logMessage = this.createServiceTraceLogMessage(trace);
        if (trace.success) {
          this.loggingProvider.success(logMessage);
        } else {
          this.loggingProvider.warning(logMessage);
        }
      } catch (error: any) {
        this.loggingProvider.error(`context: ${this.serviceContext} name: serviceTraceError message: ${error.message} stack: ${error.stack}`);
      }
    }
  }

  private createServiceTraceLogMessage(trace: ServiceTrace): string {
    return `
      Service Trace Log:
      Context: ${trace.context}
      Transaction ID: ${trace.transactionId}
      Origin: ${trace.origin}
      Client IP: ${trace.client?.ip}
      User Agent: ${trace.client?.agent}
      Start Date: ${trace.startDate}
      End Date: ${trace.endDate}
      Success: ${trace.success}
      Payload: ${JSON.stringify(trace.payload)}
      Metadata: ${JSON.stringify(trace.metadata)}
    `;
  }
}
