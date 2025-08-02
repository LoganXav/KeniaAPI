import { autoInjectable } from "tsyringe";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import GuardianUpdateService from "../services/GuardianUpdate.service";
import { guardianUpdateSchema } from "../validators/GuardianUpdateSchema";

@autoInjectable()
export default class GuardianUpdateController extends BaseController {
  static controllerName: string;
  private guardianUpdateService: GuardianUpdateService;

  constructor(guardianUpdateService: GuardianUpdateService) {
    super();
    this.controllerName = "GuardianUpdateController";
    this.guardianUpdateService = guardianUpdateService;
  }

  update: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.guardianUpdateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/guardian/update/:id",
      handlers: [validateData(guardianUpdateSchema), this.update],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update a guardian",
    });
  }
}
