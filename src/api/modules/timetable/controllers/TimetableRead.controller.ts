import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import TimetableReadService from "../services/TimetableRead.service";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData, validateParams } from "~/api/shared/helpers/middleware/validateData";
import { timetableReadSchema, timetableFullRequestSchema } from "../validators/TimetableReadSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
@autoInjectable()
export default class TimetableReadController extends BaseController {
  static controllerName: string;
  private timetableReadService: TimetableReadService;

  constructor(timetableReadService: TimetableReadService) {
    super();
    this.controllerName = "TimetableReadController";
    this.timetableReadService = timetableReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.timetableReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  readOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.timetableReadService.readOne(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  readFullTimetable: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.timetableReadService.readFullTimetable(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      path: "/timetable/list",
      method: HttpMethodEnum.POST,
      handlers: [validateData(timetableReadSchema), this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get all timetables",
    });

    this.addRoute({
      path: "/timetable/info",
      method: HttpMethodEnum.POST,
      handlers: [validateParams(timetableReadSchema), this.readOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get a single timetable",
    });

    this.addRoute({
      path: "/timetable/full",
      method: HttpMethodEnum.POST,
      handlers: [validateData(timetableFullRequestSchema), this.readFullTimetable],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get full timetable for a class division for the whole term",
    });
  }
}
