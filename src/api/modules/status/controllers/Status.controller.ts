import { autoInjectable } from "tsyringe";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import PingService from "../services/Ping.service";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";

@autoInjectable()
export default class StatusController extends BaseController {
  static controllerName: string;
  pingService: PingService;
  constructor(pingService: PingService) {
    super();
    this.controllerName = "StatusController";
    this.pingService = pingService;
  }

  ping: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResult(res, next, this.pingService.execute(res.trace), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.TEXT_PLAIN,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());
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
    });
    // NOTE -- This is how you add more routes
    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/pong",
      handlers: [this.ping],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "API status endpoint",
    });
  }
}
