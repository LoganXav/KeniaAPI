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
import { createProprietorRecordSchema } from "../validators/ProprietorRecordCreationSchema"
import { refreshOtpTokenSchema } from "../validators/RefreshOtpTokenSchema"

@autoInjectable()
export default class AuthController extends BaseController {
  static controllerName: string
  authSignUpService: AuthSignUpService
  authRefreshOtpTokenService: AuthRefreshOtpTokenService
  constructor(
    authSignUpService: AuthSignUpService,
    authRefreshOtpTokenService: AuthRefreshOtpTokenService
  ) {
    super()
    this.controllerName = "AuthController"
    this.authSignUpService = authSignUpService
    this.authRefreshOtpTokenService = authRefreshOtpTokenService
  }
  register: EntryPointHandler = async (
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
  public initializeRoutes(router: IRouter): void {
    this.setRouter(router())
    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/auth/signup",
      handlers: [validateData(createProprietorRecordSchema), this.register],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED
        }
      ],
      description: "Create New Tenant and Proprietor Record"
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
      description: "Request Email Verification Token"
    })
  }
}
