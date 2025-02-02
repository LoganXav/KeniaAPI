import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateParams } from "~/api/shared/helpers/middleware/validateData";
import { staffTemplateParamsSchema } from "../validators/StaffTemplateSchema";
import StaffTemplateService from "../services/StaffTemplate.service";

@autoInjectable()
export default class StaffTemplateController extends BaseController {
  static controllerName: string;
  staffTemplateService: StaffTemplateService;
  constructor(staffTemplateService: StaffTemplateService) {
    super();
    this.controllerName = "StaffTemplateController";
    this.staffTemplateService = staffTemplateService;
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
      handlers: [validateParams(staffTemplateParamsSchema), this.template],
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
