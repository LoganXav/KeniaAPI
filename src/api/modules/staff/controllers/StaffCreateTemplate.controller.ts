import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import OnboardingTemplateService from "../services/StaffCreateTemplate.service";
import { validateParams } from "~/api/shared/helpers/middleware/validateData";
import { staffTemplateParamsSchema } from "../validators/StaffTemplateSchema";

@autoInjectable()
export default class OnboardingTemplateController extends BaseController {
  static controllerName: string;
  onboardingTemplateService: OnboardingTemplateService;
  constructor(onboardingTemplateService: OnboardingTemplateService) {
    super();
    this.controllerName = "StaffOnboardingTemplateController";
    this.onboardingTemplateService = onboardingTemplateService;
  }

  template: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.onboardingTemplateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/template",
      handlers: [validateParams(staffTemplateParamsSchema), this.template],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Staff Onboarding Template",
    });
  }
}
