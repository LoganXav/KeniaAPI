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
import AuthRefreshOtpTokenService from "../services/AuthRefreshOtpToken.service"
import AuthVerifyOtpTokenService from "../services/AuthVerifyOtpToken.service"

import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema"
import { verifyOtpTokenSchema } from "../validators/VerifyOtpSchema"

@autoInjectable()
export default class AuthOtpTokenController extends BaseController {
  static controllerName: string
  authRefreshOtpTokenService: AuthRefreshOtpTokenService
  authVerifyOtpTokenService: AuthVerifyOtpTokenService
  constructor(
    authRefreshOtpTokenService: AuthRefreshOtpTokenService,
    authVerifyOtpTokenService: AuthVerifyOtpTokenService
  ) {
    super()
    this.controllerName = "AuthOtpTokenController"
    this.authRefreshOtpTokenService = authRefreshOtpTokenService
    this.authVerifyOtpTokenService = authVerifyOtpTokenService
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
