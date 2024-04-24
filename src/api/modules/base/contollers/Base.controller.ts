import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { ServiceContext } from "~/api/shared/helpers/enums/ServiceContext.enum"
import {
  HeaderType,
  INextFunction,
  IResponse,
  IRouter,
} from "~/infrastructure/internal/types"
import { HttpStatusResolver } from "../helpers/HttpStatusResolver"
import statusMapping from "../helpers/StatusMapping"
import { RouteType } from "../types"
// import { ERROR } from "~/api/shared/helpers/messages/SystemMessages"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { ServiceTrace } from "~/api/shared/helpers/logs/ServiceTrace"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"

// TODO - Fix the trace for error monitoring

export default abstract class BaseController {
  router?: IRouter
  serviceContext: ServiceContext
  loggingProvider: ILoggingDriver
  constructor(serviceContext: ServiceContext = ServiceContext.KENIA_EXPRESS) {
    this.serviceContext = serviceContext
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public abstract initializeRoutes(router: IRouter): void

  public setRouter(router: IRouter): void {
    this.router = router
  }

  public addRoute(route: RouteType): void {
    const { produces, method, handlers, path, description } = route
    produces.forEach(({ applicationStatus, httpStatus }) =>
      this.setProducesCode(applicationStatus, httpStatus)
    )

    if (!this.router) {
      throw new Error(
        "Router not initialized, you should call setRouter before addRoute."
      )
    }
    // Calls the routes with the path and handlers i.e controllers
    this.router[method](path, ...handlers)

    // TODO -- Create Api Generator Route Doc
    // method,
    // path,
    // produces,
    // description,
  }

  public async handleResultData(
    res: IResponse,
    next: INextFunction,
    servicePromise: Promise<IResult>,
    headersToSet?: HeaderType
  ): Promise<void> {
    try {
      return await this.getResultData(res, await servicePromise, headersToSet)
    } catch (error) {
      return next(error)
    } finally {
      this.manageServiceTrace(res.trace)
    }
  }

  public async handleResult(
    res: IResponse,
    next: INextFunction,
    servicePromise: Promise<IResult>,
    headersToSet?: HeaderType
  ): Promise<void> {
    try {
      return await this.getResult(res, await servicePromise, headersToSet)
    } catch (error) {
      return next(error)
    } finally {
      this.manageServiceTrace(res.trace)
    }
  }

  // <===========+ Helper Methods +============>

  private async getResultData(
    res: IResponse,
    result: IResult,
    headersToSet?: HeaderType
  ): Promise<void> {
    this.setTransactionId(res)
    this.setHeaders(res, headersToSet)
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString()))
      .json(result.message ? result.toResultDto() : result.toResultDto().data)
  }

  private setHeaders(res: IResponse, headersToSet?: HeaderType): void {
    if (headersToSet) {
      Object.entries(headersToSet).forEach(([key, value]) =>
        res.setHeader(key, value)
      )
    }
  }

  private async getResult(
    res: IResponse,
    result: IResult,
    headersToSet?: HeaderType
  ): Promise<void> {
    this.setTransactionId(res)
    this.setHeaders(res, headersToSet)
    res
      .status(HttpStatusResolver.getCode(result.statusCode.toString()))
      .json(result)
  }

  private setProducesCode(
    applicationStatus: string,
    httpStatus: HttpStatusCodeEnum
  ): void {
    if (!statusMapping[applicationStatus]) {
      statusMapping[applicationStatus] = httpStatus
    }
  }

  private setTransactionId(res: IResponse): void {
    res.setHeader(HttpHeaderEnum.TRANSACTION_ID, res.trace.transactionId)
  }

  private async manageServiceTrace(trace: ServiceTrace): Promise<void> {
    if (trace?.context) {
      trace.finish(new Date())
      return Promise.resolve()
      // TODO -- Implement service trace repository
      // return Promise.resolve(this.ServiceTraceRepository.register(trace)).catch(
      //   (error) => {
      //     this.loggingProvider.error(`context: ${this.serviceContext} name: serviceTraceError message: ${error.message} stack: ${error.stack}
      //     `)
      //   }
      // )
    }
  }
}
