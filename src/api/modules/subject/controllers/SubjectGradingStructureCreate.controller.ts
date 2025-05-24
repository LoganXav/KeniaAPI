import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import SubjectGradingStructureCreateService from "~/api/modules/subject/services/SubjectGradingStructureCreate.service";
import { subjectGradingStructureCreateSchema } from "~/api/modules/subject/validators/SubjectGradingStructureCreateSchema";

@autoInjectable()
export default class SubjectGradingStructureCreateController extends BaseController {
  static controllerName: string;
  private subjectGradingStructureCreateService: SubjectGradingStructureCreateService;

  constructor(subjectGradingStructureCreateService: SubjectGradingStructureCreateService) {
    super();
    this.controllerName = "SubjectGradingStructureCreateController";
    this.subjectGradingStructureCreateService = subjectGradingStructureCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectGradingStructureCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/gradingstructure/create",
      handlers: [validateData(subjectGradingStructureCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create or edit a subject grading structure",
    });
  }
}
