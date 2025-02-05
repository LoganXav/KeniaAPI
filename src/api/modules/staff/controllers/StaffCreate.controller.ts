import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { staffCreateRequestSchema } from "../validators/StaffCreateSchema";
import { PropTypeEnum, ResultTDescriber, TypeDescriber } from "~/infrastructure/internal/documentation/TypeDescriber";
import { StaffCreateRequestType, StaffCreateResponseType } from "../types/StaffTypes";
import StaffCreateService from "../services/StaffCreate.service";

@autoInjectable()
export default class StaffCreateController extends BaseController {
  static controllerName: string;
  private staffCreateService: StaffCreateService;
  constructor(StaffCreateService: StaffCreateService) {
    super();
    this.controllerName = "StaffCreateController";
    this.staffCreateService = StaffCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.staffCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/staff/create",
      handlers: [validateData(staffCreateRequestSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create Staff",
    });
  }
}
