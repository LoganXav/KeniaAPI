import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { onboardingPersonalSchema, onboardingResidentialSchema, onboardingSchoolSchema } from "../validators/OnboardingSchema";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import OnboardingService from "../services/Onboarding.service";

@autoInjectable()
export default class OnboardingController extends BaseController {
  static controllerName: string;
  onboardingService: OnboardingService;
  constructor(onboardingService: OnboardingService) {
    super();
    this.controllerName = "OnboardingProcessController";
    this.onboardingService = onboardingService;
  }

  personalInformation: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.onboardingService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };
  residentialInformation: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.onboardingService.residentialInformation(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };
  schoolInformation: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.onboardingService.schoolInformation(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/onboarding/personal",
      handlers: [validateData(onboardingPersonalSchema), this.personalInformation],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Onboarding Personal Information",
    });
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/onboarding/residential",
      handlers: [validateData(onboardingResidentialSchema), this.residentialInformation],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Onboarding Residential Information",
    });
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/onboarding/school",
      handlers: [validateData(onboardingSchoolSchema), this.schoolInformation],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Onboarding School Information",
    });
  }
}
