import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { studentCreateRequestSchema } from "../validators/StudentCreateSchema";
import StudentCreateService from "../services/StudentCreate.service";

@autoInjectable()
export default class StudentCreateController extends BaseController {
  static controllerName: string;
  private studentCreateService: StudentCreateService;
  constructor(StudentCreateService: StudentCreateService) {
    super();
    this.controllerName = "StudentCreateController";
    this.studentCreateService = StudentCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/create",
      handlers: [validateData(studentCreateRequestSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Student",
    });
  }
}
