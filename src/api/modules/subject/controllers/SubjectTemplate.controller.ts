import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import SubjectTemplateService from "../services/SubjectTemplate.service";
import { subjectTemplateSchema } from "../validators/SubjectTemplateSchema";

@autoInjectable()
export default class SubjectTemplateController extends BaseController {
  static controllerName: string;
  subjectTemplateService: SubjectTemplateService;

  constructor(subjectTemplateService: SubjectTemplateService) {
    super();
    this.controllerName = "SubjectTemplateController";
    this.subjectTemplateService = subjectTemplateService;
  }

  template: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectTemplateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/template",
      handlers: [validateData(subjectTemplateSchema), this.template],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Subject Creation Template",
    });
  }
}
