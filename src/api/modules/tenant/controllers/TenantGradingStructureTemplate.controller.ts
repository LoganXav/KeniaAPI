import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { tenantGradingStructureReadSchema } from "~/api/modules/tenant/validators/TenantGradingStructureReadSchema";
import TenantGradingStructureTemplateService from "~/api/modules/tenant/services/TenantGradingStructureTemplate.service";

@autoInjectable()
export default class TenantGradingStructureTemplateController extends BaseController {
  static controllerName: string;
  private tenantGradingStructureTemplateService: TenantGradingStructureTemplateService;

  constructor(tenantGradingStructureTemplateService: TenantGradingStructureTemplateService) {
    super();
    this.controllerName = "TenantGradingStructureTemplateController";
    this.tenantGradingStructureTemplateService = tenantGradingStructureTemplateService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.tenantGradingStructureTemplateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/tenant/gradingstructure/template",
      handlers: [validateData(tenantGradingStructureReadSchema), this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get the template for creating a tenant grading structure",
    });
  }
}
