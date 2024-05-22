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
import AuthService from "../services/Auth.service"

@autoInjectable()
export default class AuthController extends BaseController {
  authService: AuthService
  constructor(authService: AuthService) {
    super()
    this.authService = authService
  }
  createUser: EntryPointHandler = async (
    req: IRequest,
    res: IResponse,
    next: INextFunction
  ): Promise<void> => {
    //   TODO - Validate First
    const name = req.body?.name as string
    const email = req.body?.email as string

    return this.handleResultData(
      res,
      next,
      this.authService.execute({ name, email }),
      {
        [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON
      }
    )
  }
  public initializeRoutes(router: IRouter): void {
    this.setRouter(router())

    this.addRoute({
      method: HttpMethodEnum.GET,
      path: "/user/create",
      handlers: [this.createUser],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS
        }
      ],
      description: "API status endpoint"
    })
  }
}
