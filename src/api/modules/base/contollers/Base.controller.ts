import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { ServiceContext } from "~/api/shared/helpers/enums/ServiceContext.enum"
import { UseCaseTrace } from "~/api/shared/helpers/logs/UseCaseTrace"
import {
  HeaderType,
  INextFunction,
  IResponse,
  IRouter,
} from "~/infrastructure/internal/types"
import { HttpStatusResolver } from "../helpers/HttpStatusResolver"
import statusMapping from "../helpers/StatusMapping"
import { RouteType } from "../types"
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages"
import { IResult } from "~/api/shared/helpers/results/IResult"

export default abstract class BaseController {
  router?: IRouter
  serviceContext: ServiceContext
  constructor(serviceContext: ServiceContext = ServiceContext.KENIA_EXPRESS) {
    this.serviceContext = serviceContext
  }

  abstract initializeRoutes(router: IRouter): void

  setRouter(router: IRouter): void {
    this.router = router
  }

  addRoute(route: RouteType): void {
    const { produces, method, handlers, path } = route
    produces.forEach(({ applicationStatus, httpStatus }) =>
      this.setProducesCode(applicationStatus, httpStatus)
    )

    if (!this.router) {
      throw new Error(
        "Router not initialized, you should call setRouter before addRoute."
      )
    }
    this.router[method](path, ...handlers)

    // TODO -- Create Api Generator Route Doc
  }

  setProducesCode(
    applicationStatus: string,
    httpStatus: HttpStatusCodeEnum
  ): void {
    if (!statusMapping[applicationStatus]) {
      statusMapping[applicationStatus] = httpStatus
    }
  }

  async handleResultData(
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
      // this.manageUseCaseTrace(res.trace);
    }
  }

  // <===========+ Helper Methods +============>

  private async getResultData(
    res: IResponse,
    result: IResult,
    headersToSet?: HeaderType
  ): Promise<void> {
    // this.setTransactionId(res)
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

  // private setTransactionId(res: IResponse): void {
  //   res.setHeader(HttpHeaderEnum.TRANSACTION_ID, res.trace.transactionId)
  // }

  // async handleResult(
  //   res: IResponse,
  //   next: INextFunction,
  //   useCasePromise: Promise<any>,
  //   headersToSet?: HeaderType
  // ): Promise<void> {
  //   try {
  //     return await this.getResult(res, await useCasePromise, headersToSet)
  //   } catch (error) {
  //     return next(error)
  //   } finally {
  //     this.manageUseCaseTrace(res.trace)
  //   }
  // }

  // private async getResult(
  //   res: IResponse,
  //   result: any,
  //   headersToSet?: HeaderType
  // ): Promise<void> {
  //   this.setTransactionId(res)
  //   this.setHeaders(res, headersToSet)
  //   res
  //     .status(HttpStatusResolver.getCode(result.statusCode.toString()))
  //     .json(result)
  // }

  // private async manageUseCaseTrace(trace: UseCaseTrace): Promise<void> {
  //   if (trace?.context) {
  //     trace.finish(new Date())
  //     return Promise.resolve(
  //       this.#useCaseTraceRepository.register(trace)
  //     ).catch((error) => {
  //       this.#logProvider.logError(
  //         new ErrorLog({
  //           context: this.CONTEXT,
  //           name: "ManageUseCaseTraceError",
  //           message: error.message,
  //           stack: error.stack,
  //         })
  //       )
  //     })
  //   }
  // }
}
