import { autoInjectable } from "tsyringe";
import { VerifyOtpTokenResponseType } from "../types/AuthTypes";
import { VerifyUserTokenType } from "../../user/types/UserTypes";
import BaseController from "../../base/contollers/Base.controller";
import { verifyOtpTokenSchema } from "../validators/VerifyOtpSchema";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import AuthVerifyOtpTokenService from "../services/AuthVerifyOtpToken.service";
import AuthRefreshOtpTokenService from "../services/AuthRefreshOtpToken.service";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { PropFormatEnum, PropTypeEnum, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";

@autoInjectable()
export default class AuthOtpTokenController extends BaseController {
  static controllerName: string;
  authRefreshOtpTokenService: AuthRefreshOtpTokenService;
  authVerifyOtpTokenService: AuthVerifyOtpTokenService;
  constructor(authRefreshOtpTokenService: AuthRefreshOtpTokenService, authVerifyOtpTokenService: AuthVerifyOtpTokenService) {
    super();
    this.controllerName = "AuthOtpTokenController";
    this.authRefreshOtpTokenService = authRefreshOtpTokenService;
    this.authVerifyOtpTokenService = authVerifyOtpTokenService;
  }

  refreshOtpToken: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.authRefreshOtpTokenService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };
  verifyOtpToken: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.authVerifyOtpTokenService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/auth/otp/refresh",
      handlers: [validateData(refreshOtpTokenSchema), this.refreshOtpToken],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Request OTP Verification Token",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/otp/verify",
      handlers: [validateData(verifyOtpTokenSchema), this.verifyOtpToken],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Verify OTP Verification Token",
      apiDoc: {
        contentType: HttpContentTypeEnum.APPLICATION_JSON,
        requireAuth: false,
        schema: new ResultTDescriber<VerifyOtpTokenResponseType>({
          name: "VerifyOtpTokenResponse",
          type: PropTypeEnum.OBJECT,
          props: {
            data: new TypeDescriber<VerifyOtpTokenResponseType>({
              name: "VerifyOtpTokenResponse",
              type: PropTypeEnum.OBJECT,
              props: {
                id: {
                  type: PropTypeEnum.NUMBER,
                },
                firstName: {
                  type: PropTypeEnum.STRING,
                },
                lastName: {
                  type: PropTypeEnum.STRING,
                },
                phoneNumber: {
                  type: PropTypeEnum.STRING,
                },
                email: {
                  type: PropTypeEnum.STRING,
                },
                hasVerified: {
                  type: PropTypeEnum.BOOLEAN,
                },
                isFirstTimeLogin: {
                  type: PropTypeEnum.BOOLEAN,
                },
                lastLoginDate: {
                  type: PropTypeEnum.STRING,
                  format: PropFormatEnum.DATE_TIME,
                },
                userType: {
                  type: PropTypeEnum.STRING,
                },
                tenantId: { type: PropTypeEnum.NUMBER },
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
          description: "VerifyOtpTokenRequest",
          contentType: HttpContentTypeEnum.APPLICATION_JSON,
          schema: new TypeDescriber<VerifyUserTokenType>({
            name: "VerifyOtpTokenRequest",
            type: PropTypeEnum.OBJECT,
            props: {
              id: {
                type: PropTypeEnum.NUMBER,
                required: true,
              },
              otpToken: {
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
