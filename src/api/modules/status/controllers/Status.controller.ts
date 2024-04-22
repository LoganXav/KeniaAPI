import {
  EntryPointHandler,
  INextFunction,
  IRequest,
  IResponse,
  IRouter,
} from "~/infrastructure/internal/types"
import BaseController from "../../base/contollers/Base.controller"
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum"
import PingService from "../services/PingService"
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum"
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum"

class StatusController extends BaseController {
  constructor() {
    super()
  }

  ping: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    return this.handleResultData(res, next, PingService.execute(), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.TEXT_PLAIN,
    })
  }

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router())
    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/ping",
      handlers: [this.ping],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "API status endpoint",
    })
  }
}

export default new StatusController()
