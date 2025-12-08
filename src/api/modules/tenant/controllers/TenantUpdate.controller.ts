import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/controllers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import TenantUpdateService from "../services/TenantUpdate.service";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { tenantUpdateSchema } from "../validators/TenantUpdateSchema";

@autoInjectable()
export default class TenantUpdateController extends BaseController {
  static controllerName: string;
  tenantUpdateService: TenantUpdateService;
  constructor(tenantUpdateService: TenantUpdateService) {
    super();
    this.controllerName = "TenantUpdateController";
    this.tenantUpdateService = tenantUpdateService;
  }

  updateOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.tenantUpdateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/tenant/update",
      handlers: [validateData(tenantUpdateSchema), this.updateOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "User Info",
    });
  }
}
