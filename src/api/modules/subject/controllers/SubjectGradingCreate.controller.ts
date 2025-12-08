import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import SubjectGradingCreateService from "~/api/modules/subject/services/SubjectGradingCreate.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { subjectBulkGradingCreateRequestSchema, subjectGradingCreateRequestSchema } from "~/api/modules/subject/validators/SubjectGradingSchema";

@autoInjectable()
export default class SubjectGradingCreateController extends BaseController {
  static controllerName: string;
  private subjectGradingCreateService: SubjectGradingCreateService;

  constructor(subjectGradingCreateService: SubjectGradingCreateService) {
    super();
    this.controllerName = "SubjectGradingCreateController";
    this.subjectGradingCreateService = subjectGradingCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectGradingCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  createBulk: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectGradingCreateService.createBulk(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/grading/create",
      handlers: [validateData(subjectGradingCreateRequestSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Submit grades for a subject",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/grading/bulk/create",
      handlers: [validateData(subjectBulkGradingCreateRequestSchema), this.createBulk],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Bulk submit grades for a subject",
    });
  }
}
