import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import StudentCalendarResultReadService from "../services/StudentCalendarResultRead.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StudentTermResultReadController extends BaseController {
  static controllerName: string;
  private studentCalendarResultReadService: StudentCalendarResultReadService;
  constructor(studentCalendarResultReadService: StudentCalendarResultReadService) {
    super();
    this.controllerName = "StudentCalendarResultReadController";
    this.studentCalendarResultReadService = studentCalendarResultReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentCalendarResultReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/calendarresult/list",
      handlers: [this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "List of Student Calendar Results",
    });
  }
}
