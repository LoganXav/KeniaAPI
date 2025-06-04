import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import SchoolCalendarReadService from "../services/SchoolCalendarRead.service";
import { schoolCalendarReadSchema } from "../validators/SchoolCalendarReadSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
@autoInjectable()
export default class SchoolCalendarReadController extends BaseController {
  static controllerName: string;
  schoolCalendarReadService: SchoolCalendarReadService;

  constructor(schoolCalendarReadService: SchoolCalendarReadService) {
    super();
    this.controllerName = "SchoolCalendarReadController";
    this.schoolCalendarReadService = schoolCalendarReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.schoolCalendarReadService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  readOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.schoolCalendarReadService.readOne(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      path: "/calendar/list",
      method: HttpMethodEnum.POST,
      handlers: [this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get all school calendars",
    });

    this.addRoute({
      path: "/calendar/info",
      method: HttpMethodEnum.POST,
      handlers: [this.readOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get a Single School Calendar",
    });
  }
}
