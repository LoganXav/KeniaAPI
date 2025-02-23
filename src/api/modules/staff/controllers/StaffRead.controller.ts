import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import StaffReadService from "../services/StaffRead.service";
import { staffCriteriaSchema } from "../validators/StaffCreateSchema";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { staffReadOneParamsSchema, staffReadParamsSchema } from "../validators/StaffReadSchema";

@autoInjectable()
export default class StaffUpdateController extends BaseController {
  static controllerName: string;
  private staffReadService: StaffReadService;
  constructor(staffReadService: StaffReadService) {
    super();
    this.controllerName = "StaffReadController";
    this.staffReadService = staffReadService;
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
      handlers: [validateData(staffReadParamsSchema), this.staffRead],
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
      handlers: [validateData(staffReadOneParamsSchema), this.staffReadOne],
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
