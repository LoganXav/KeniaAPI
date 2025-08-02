import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import PermissionMiddleware from "~/api/shared/helpers/middleware/permissions";
import StaffUpdateService from "~/api/modules/staff/services/StaffUpdate.service";
import { PERMISSIONS } from "~/api/shared/helpers/constants/Permissions.constants";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { staffUpdateManySchema, staffUpdateSchema } from "~/api/modules/staff/validators/StaffUpdateSchema";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StaffUpdateController extends BaseController {
  static controllerName: string;
  private staffUpdateService: StaffUpdateService;
  private permissionMiddleware: PermissionMiddleware;

  constructor(staffUpdateService: StaffUpdateService, permissionMiddleware: PermissionMiddleware) {
    super();
    this.controllerName = "StaffUpdateController";
    this.staffUpdateService = staffUpdateService;
    this.permissionMiddleware = permissionMiddleware;
  }

  updateMany: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffUpdateService.updateMany(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  updateOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffUpdateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/update/:id",
      handlers: [validateData(staffUpdateSchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.UPDATE), this.updateOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Staff Information",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/update_many",
      handlers: [validateData(staffUpdateManySchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.UPDATE), this.updateMany],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update Staffs Information",
    });
  }
}
