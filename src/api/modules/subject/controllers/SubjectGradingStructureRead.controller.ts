import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import SubjectGradingStructureReadService from "~/api/modules/subject/services/SubjectGradingStructureRead.service";
import { subjectGradingStructureReadSchema } from "~/api/modules/subject/validators/SubjectGradingStructureReadSchema";

@autoInjectable()
export default class SubjectGradingStructureReadController extends BaseController {
  static controllerName: string;
  private subjectGradingStructureReadService: SubjectGradingStructureReadService;

  constructor(subjectGradingStructureReadService: SubjectGradingStructureReadService) {
    super();
    this.controllerName = "SubjectGradingStructureReadController";
    this.subjectGradingStructureReadService = subjectGradingStructureReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectGradingStructureReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  readOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectGradingStructureReadService.readOne(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/gradingstructure/info/:id",
      handlers: [validateData(subjectGradingStructureReadSchema), this.readOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Read a subject grading structure",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/gradingstructure/list",
      handlers: [validateData(subjectGradingStructureReadSchema), this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Read a list subject grading structures",
    });
  }
}
