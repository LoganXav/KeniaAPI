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
import { userRegistrationSchema } from "../validators/userRegistrationSchema"
import { validateData } from "~/api/shared/helpers/middleware/validateData"
import AuthSignUpService from "../services/AuthSignUp.service"

@autoInjectable()
export default class AuthController extends BaseController {
  authSignUpService: AuthSignUpService
  constructor(authSignUpService: AuthSignUpService) {
    super()
    this.authSignUpService = authSignUpService
  }
  register: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    return this.handleResultData(
      res,
      next,
      this.authSignUpService.execute(req.body, res),
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
      handlers: [validateData(userRegistrationSchema), this.register],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED
        }
      ],
      description: "Register a new principal"
    })
  }
}
