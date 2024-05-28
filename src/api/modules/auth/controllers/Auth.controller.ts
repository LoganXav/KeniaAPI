import {
  EntryPointHandler,
  INextFunction,
  IRequest,
  IResponse,
  IRouter
} from "~/infrastructure/internal/types"
import BaseController from "../../base/contollers/Base.controller"
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum"
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum"
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum"
import { autoInjectable } from "tsyringe"
import { validateData } from "~/api/shared/helpers/middleware/validateData"
import AuthSignUpService from "../services/AuthSignUp.service"
import AuthRefreshOtpTokenService from "../services/AuthRefreshOtpToken.service"
import AuthVerifyOtpTokenService from "../services/AuthVerifyOtpToken.service"
import AuthSignInService from "../services/AuthSignIn.service"

import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema"
import { verifyOtpTokenSchema } from "../validators/VerifyOtpSchema"
import { signUpUserRecordSchema } from "../validators/SignUpUserRecordSchema"
import { signInUserRecordSchema } from "../validators/SignInUserRecordSchema"

@autoInjectable()
export default class AuthController extends BaseController {
  static controllerName: string
  authSignUpService: AuthSignUpService
  authSignInService: AuthSignInService
  authRefreshOtpTokenService: AuthRefreshOtpTokenService
  authVerifyOtpTokenService: AuthVerifyOtpTokenService
  constructor(
    authSignUpService: AuthSignUpService,
    authSignInService: AuthSignInService,
    authRefreshOtpTokenService: AuthRefreshOtpTokenService,
    authVerifyOtpTokenService: AuthVerifyOtpTokenService
  ) {
    super()
    this.controllerName = "AuthController"
    this.authSignUpService = authSignUpService
    this.authSignInService = authSignInService
    this.authRefreshOtpTokenService = authRefreshOtpTokenService
    this.authVerifyOtpTokenService = authVerifyOtpTokenService
  }

  signUp: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.authSignUpService.execute(res.trace, req.body),
      {
        [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
      }
    )
  }

  signIn: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.authSignInService.execute(res.trace, req.body),
      {
        [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
      }
    )
  }

  refreshOtpToken: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.authRefreshOtpTokenService.execute(res.trace, req.body),
      {
        [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
      }
    )
  }
  verifyOtpToken: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.authVerifyOtpTokenService.execute(res.trace, req.body),
      {
        [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
      }
    )
  }

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router())

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/signup",
      handlers: [validateData(signUpUserRecordSchema), this.signUp],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED
        }
      ],
      description: "Sign Up New Tenant and User Record"
    })

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/signin",
      handlers: [validateData(signInUserRecordSchema), this.signIn],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS
        }
      ],
      description: "Sign In User"
    })

    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/auth/otp/refresh",
      handlers: [validateData(refreshOtpTokenSchema), this.refreshOtpToken],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS
        }
      ],
      description: "Request OTP Verification Token"
    })

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/otp/verify",
      handlers: [validateData(verifyOtpTokenSchema), this.verifyOtpToken],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS
        }
      ],
      description: "Verify OTP Verification Token"
    })
  }
}
