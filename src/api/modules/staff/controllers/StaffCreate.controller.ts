import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import PermissionMiddleware from "~/api/shared/helpers/middleware/permissions";
import StaffCreateService from "~/api/modules/staff/services/StaffCreate.service";
import { PERMISSIONS } from "~/api/shared/helpers/constants/Permissions.constants";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { staffBulkCreateRequestSchema, staffCreateRequestSchema } from "~/api/modules/staff/validators/StaffCreateSchema";

@autoInjectable()
export default class StaffCreateController extends BaseController {
  static controllerName: string;
  private staffCreateService: StaffCreateService;
  private permissionMiddleware: PermissionMiddleware;

  constructor(StaffCreateService: StaffCreateService, permissionMiddleware: PermissionMiddleware) {
    super();
    this.controllerName = "StaffCreateController";
    this.staffCreateService = StaffCreateService;
    this.permissionMiddleware = permissionMiddleware;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  createBulk: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffCreateService.createBulk(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/create",
      handlers: [validateData(staffCreateRequestSchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.CREATE), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Staff",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/bulk/create",
      handlers: [validateData(staffBulkCreateRequestSchema), this.permissionMiddleware.checkPermission(PERMISSIONS.STAFF.CREATE), this.createBulk],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Bulk Create Staff",
    });
  }
}
