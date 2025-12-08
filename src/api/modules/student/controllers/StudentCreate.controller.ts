import { autoInjectable } from "tsyringe";
import BaseController from "../../base/controllers/Base.controller";
import StudentCreateService from "../services/StudentCreate.service";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { studentBulkCreateRequestSchema, studentCreateRequestSchema } from "../validators/StudentCreateSchema";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

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

  createBulk: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentCreateService.createBulk(res.trace, req), {
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

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/bulk/create",
      handlers: [validateData(studentBulkCreateRequestSchema), this.createBulk],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Bulk Create Student",
    });
  }
}
