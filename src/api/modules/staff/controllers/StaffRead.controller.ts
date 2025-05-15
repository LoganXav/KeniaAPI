import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import StaffReadService from "~/api/modules/staff/services/StaffRead.service";
import PermissionMiddleware from "~/api/shared/helpers/middleware/Permissions";
import { PERMISSIONS } from "~/api/shared/helpers/constants/Permissions.constants";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { staffReadOneParamsSchema, staffReadParamsSchema } from "~/api/modules/staff/validators/StaffReadSchema";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
@autoInjectable()
export default class StaffReadController extends BaseController {
  static controllerName: string;
  private staffReadService: StaffReadService;
  private permissionMiddleware: PermissionMiddleware;

  constructor(staffReadService: StaffReadService, permissionMiddleware: PermissionMiddleware) {
    super();
    this.controllerName = "StaffReadController";
    this.staffReadService = staffReadService;
    this.permissionMiddleware = permissionMiddleware;
  }

  staffReadOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  staffRead: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffReadService.staffRead(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/list",
      handlers: [validateData(staffReadParamsSchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.READ), this.staffRead],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get Staff List",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/info/:id",
      handlers: [validateData(staffReadOneParamsSchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.READ), this.staffReadOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get Single Staff",
    });
  }
}
