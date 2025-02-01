import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import DeleteStaffService from "../services/StaffDelete.service";

@autoInjectable()
export default class StaffUpdateController extends BaseController {
  static controllerName: string;
  private deleteStaffService: DeleteStaffService;
  constructor(deleteStaffService: DeleteStaffService) {
    super();
    this.controllerName = "StaffDeleteController";
    this.deleteStaffService = deleteStaffService;
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
      handlers: [this.deleteOneStaff],
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
      handlers: [this.deleteStaffs],
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
