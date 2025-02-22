import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import StudentDeleteService from "../services/StudentDelete.service";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { studentReadOneParamsSchema } from "../validators/StudentReadSchema";
import { validateParams } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StudentDeleteController extends BaseController {
  static controllerName: string;
  private deleteStudentService: StudentDeleteService;
  constructor(deleteStudentService: StudentDeleteService) {
    super();
    this.controllerName = "StudentDeleteController";
    this.deleteStudentService = deleteStudentService;
  }

  deleteOneStudent: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.deleteStudentService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  deleteStudents: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.deleteStudentService.deleteStudents(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/delete",
      handlers: [validateParams(studentReadOneParamsSchema), this.deleteOneStudent],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete Student Information",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/delete_all",
      handlers: [validateParams(studentReadOneParamsSchema), this.deleteStudents],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete Students Information",
    });
  }
}
