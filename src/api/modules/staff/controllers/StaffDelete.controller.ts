import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import PermissionMiddleware from "~/api/shared/helpers/middleware/permissions";
import DeleteStaffService from "~/api/modules/staff/services/StaffDelete.service";
import { PERMISSIONS } from "~/api/shared/helpers/constants/Permissions.constants";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StaffUpdateController extends BaseController {
  static controllerName: string;
  private deleteStaffService: DeleteStaffService;
  private permissionMiddleware: PermissionMiddleware;

  constructor(deleteStaffService: DeleteStaffService, permissionMiddleware: PermissionMiddleware) {
    super();
    this.controllerName = "StaffDeleteController";
    this.deleteStaffService = deleteStaffService;
    this.permissionMiddleware = permissionMiddleware;
  }

  deleteOneStaff: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.deleteStaffService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  deleteStaffs: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.deleteStaffService.deleteStaffs(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/delete",
      handlers: [this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.DELETE), this.deleteOneStaff],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete Staff Information",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/delete_all",
      handlers: [this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.DELETE), this.deleteStaffs],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete Staffs Information",
    });
  }
}
