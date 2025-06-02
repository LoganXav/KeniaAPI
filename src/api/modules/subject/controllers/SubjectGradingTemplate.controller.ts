import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import SubjectGradingTemplateService from "../services/SubjectGradingTemplate.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SubjectGradingTemplateController extends BaseController {
  static controllerName: string;
  subjectGradingTemplateService: SubjectGradingTemplateService;

  constructor(subjectGradingTemplateService: SubjectGradingTemplateService) {
    super();
    this.controllerName = "SubjectGradingTemplateController";
    this.subjectGradingTemplateService = subjectGradingTemplateService;
  }

  template: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectGradingTemplateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/grading/template",
      handlers: [this.template],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Subject Grading Template",
    });
  }
}
