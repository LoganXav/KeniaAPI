import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateParams } from "~/api/shared/helpers/middleware/validateData";
import PermissionMiddleware from "~/api/shared/helpers/middleware/permissions";
import { PERMISSIONS } from "~/api/shared/helpers/constants/Permissions.constants";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import StaffTemplateService from "~/api/modules/staff/services/StaffTemplate.service";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { staffTemplateParamsSchema } from "~/api/modules/staff/validators/StaffTemplateSchema";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StaffTemplateController extends BaseController {
  static controllerName: string;
  staffTemplateService: StaffTemplateService;
  private permissionMiddleware: PermissionMiddleware;

  constructor(staffTemplateService: StaffTemplateService, permissionMiddleware: PermissionMiddleware) {
    super();
    this.controllerName = "StaffTemplateController";
    this.staffTemplateService = staffTemplateService;
    this.permissionMiddleware = permissionMiddleware;
  }

  template: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffTemplateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/template",
      handlers: [validateParams(staffTemplateParamsSchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.CREATE), this.template],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Staff Creation Template",
    });
  }
}
