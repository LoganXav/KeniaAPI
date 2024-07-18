import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import AuthSignUpService from "../services/AuthSignUp.service";
import AuthSignInService from "../services/AuthSignIn.service";

import { signUpUserRecordSchema } from "../validators/SignUpUserRecordSchema";
import { signInUserRecordSchema } from "../validators/SignInUserRecordSchema";

@autoInjectable()
export default class AuthOnboardingController extends BaseController {
  static controllerName: string;
  authSignUpService: AuthSignUpService;
  authSignInService: AuthSignInService;
  constructor(authSignUpService: AuthSignUpService, authSignInService: AuthSignInService) {
    super();
    this.controllerName = "AuthOnboardingController";
    this.authSignUpService = authSignUpService;
    this.authSignInService = authSignInService;
  }

  signUp: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.authSignUpService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  signIn: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.authSignInService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/signup",
      handlers: [validateData(signUpUserRecordSchema), this.signUp],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Sign Up New Tenant and User Record",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/signin",
      handlers: [validateData(signInUserRecordSchema), this.signIn],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Sign In User",
    });
  }
}
