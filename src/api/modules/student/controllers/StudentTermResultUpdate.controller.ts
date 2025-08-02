import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import StudentTermResultUpdateService from "~/api/modules/student/services/StudentTermResultUpdate.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { StudentTermResultUpdateRequestSchema } from "~/api/modules/student/validators/StudentTermResultUpdateSchema";

@autoInjectable()
export default class StudentTermResultUpdateController extends BaseController {
  static controllerName: string;
  private studentTermResultUpdateService: StudentTermResultUpdateService;
  constructor(studentTermResultUpdateService: StudentTermResultUpdateService) {
    super();
    this.controllerName = "StudentTermResultUpdateController";
    this.studentTermResultUpdateService = studentTermResultUpdateService;
  }

  update: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentTermResultUpdateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/termresult/:id",
      handlers: [validateData(StudentTermResultUpdateRequestSchema), this.update],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Student Term Result",
    });
  }
}
