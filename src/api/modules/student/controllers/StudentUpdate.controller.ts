import { autoInjectable } from "tsyringe";
import BaseController from "../../base/controllers/Base.controller";
import StudentUpdateService from "../services/StudentUpdate.service";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { studentUpdateManySchema, studentUpdateSchema } from "../validators/StudentUpdateSchema";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StudentUpdateController extends BaseController {
  static controllerName: string;
  private studentUpdateService: StudentUpdateService;
  constructor(studentUpdateService: StudentUpdateService) {
    super();
    this.controllerName = "StudentUpdateController";
    this.studentUpdateService = studentUpdateService;
  }

  updateMany: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentUpdateService.updateMany(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  updateOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentUpdateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/update/:id",
      handlers: [validateData(studentUpdateSchema), this.updateOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Student Information",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/update_many",
      handlers: [validateData(studentUpdateManySchema), this.updateMany],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Students Information",
    });
  }
}
