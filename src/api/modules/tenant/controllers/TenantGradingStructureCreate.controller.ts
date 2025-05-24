import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import TenantGradingStructureCreateService from "~/api/modules/tenant/services/TenantGradingStructureCreate.service";
import { tenantGradingStructureCreateSchema } from "~/api/modules/tenant/validators/TenantGradingStructureCreateSchema";

@autoInjectable()
export default class TenantGradingStructureCreateController extends BaseController {
  static controllerName: string;
  private tenantGradingStructureCreateService: TenantGradingStructureCreateService;

  constructor(tenantGradingStructureCreateService: TenantGradingStructureCreateService) {
    super();
    this.controllerName = "TenantGradingStructureCreateController";
    this.tenantGradingStructureCreateService = tenantGradingStructureCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.tenantGradingStructureCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/tenant/gradingstructure/create",
      handlers: [validateData(tenantGradingStructureCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new tenant grading structure",
    });
  }
}
