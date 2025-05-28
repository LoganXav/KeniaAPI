import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import TenantGradingStructureReadService from "~/api/modules/tenant/services/TenantGradingStructureRead.service";
import { tenantGradingStructureReadSchema } from "~/api/modules/tenant/validators/TenantGradingStructureReadSchema";

@autoInjectable()
export default class TenantGradingStructureReadController extends BaseController {
  static controllerName: string;
  private tenantGradingStructureReadService: TenantGradingStructureReadService;

  constructor(tenantGradingStructureReadService: TenantGradingStructureReadService) {
    super();
    this.controllerName = "TenantGradingStructureReadController";
    this.tenantGradingStructureReadService = tenantGradingStructureReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.tenantGradingStructureReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  readOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.tenantGradingStructureReadService.readOne(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/tenant/gradingstructure/list",
      handlers: [validateData(tenantGradingStructureReadSchema), this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get a list of the tenant grading structures",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/tenant/gradingstructure/info/:id",
      handlers: [validateData(tenantGradingStructureReadSchema), this.readOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get a single tenant grading structure",
    });
  }
}
