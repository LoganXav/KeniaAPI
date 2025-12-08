import { autoInjectable } from "tsyringe";
import BaseController from "../../base/controllers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import StudentCalendarResultUpdateService from "../services/StudentCalendarResultUpdate.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { StudentCalendarResultUpdateRequestSchema } from "../validators/StudentCalendarResultUpdateRequestSchema";

@autoInjectable()
export default class StudentCalendarResultUpdateController extends BaseController {
  static controllerName: string;
  private studentCalendarResultUpdateService: StudentCalendarResultUpdateService;

  constructor(studentCalendarResultUpdateService: StudentCalendarResultUpdateService) {
    super();
    this.controllerName = "StudentCalendarResultUpdateController";
    this.studentCalendarResultUpdateService = studentCalendarResultUpdateService;
  }

  update: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentCalendarResultUpdateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/calendarresult/:id",
      handlers: [validateData(StudentCalendarResultUpdateRequestSchema), this.update],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Student Calendar Result",
    });
  }
}
