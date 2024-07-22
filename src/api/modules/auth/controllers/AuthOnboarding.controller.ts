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
import { PropTypeEnum, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";
import { SignInUserType } from "~/api/shared/types/UserInternalApiTypes";

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
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: false,
        schema: new ResultTDescriber<any>({
          name: "Sign In Response",
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<any>({
              name: "",
              type: PropTypeEnum.OBJECT,
              // TODO: Refactor to actual sign in response object
              props: {
                id: {
                  type: PropTypeEnum.STRING,
                },
              },
            }),
            error: {
              type: PropTypeEnum.STRING,
            },
            message: {
              type: PropTypeEnum.STRING,
            },
            statusCode: {
              type: PropTypeEnum.STRING,
            },
            success: {
              type: PropTypeEnum.BOOLEAN,
            },
          },
        }),
        requestBody: {
          description: "Sign In Credentials",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<SignInUserType>({
            name: "",
            type: PropTypeEnum.OBJECT,
            props: {
              email: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              password: {
                type: PropTypeEnum.STRING,
                required: true,
              },
              userType: {
                type: PropTypeEnum.STRING,
                required: true,
              },
            },
          }),
        },
      },
    });
  }
}
