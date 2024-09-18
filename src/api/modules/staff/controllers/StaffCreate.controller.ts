import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import CreateStaffService from "../services/CreateStaff.service";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { createStaffUserSchema } from "../validators/StaffCreateSchema";

@autoInjectable()
export default class StaffCreateController extends BaseController {
  static controllerName: string;
  private createStaffService: CreateStaffService;
  constructor(createStaffService: CreateStaffService) {
    super();
    this.controllerName = "StaffCreateController";
    this.createStaffService = createStaffService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.createStaffService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  createStaffUser: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.createStaffService.createStaffUser(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/create",
      handlers: [this.create],
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
      path: "/staff/createstaffuser",
      handlers: [validateData(createStaffUserSchema), this.createStaffUser],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Staff User",
    });
  }
}
