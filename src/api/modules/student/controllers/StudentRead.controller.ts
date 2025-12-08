import { autoInjectable } from "tsyringe";
import StudentReadService from "../services/StudentRead.service";
import BaseController from "../../base/controllers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { studentReadOneParamsSchema } from "../validators/StudentReadSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StudentReadController extends BaseController {
  static controllerName: string;
  private studentReadService: StudentReadService;
  constructor(studentReadService: StudentReadService) {
    super();
    this.controllerName = "StudentReadController";
    this.studentReadService = studentReadService;
  }

  studentReadOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  studentRead: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentReadService.studentRead(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/list",
      handlers: [this.studentRead],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get Student List",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/info/:id",
      handlers: [validateData(studentReadOneParamsSchema), this.studentReadOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get Single Student",
    });
  }
}
