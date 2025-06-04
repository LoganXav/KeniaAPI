import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import SchoolCalendarTemplateService from "~/api/modules/schoolCalendar/services/SchoolCalendarTemplate.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SchoolCalendarTemplateController extends BaseController {
  static controllerName: string;
  schoolCalendarTemplateService: SchoolCalendarTemplateService;

  constructor(schoolCalendarTemplateService: SchoolCalendarTemplateService) {
    super();
    this.controllerName = "SchoolCalendarTemplateController";
    this.schoolCalendarTemplateService = schoolCalendarTemplateService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.schoolCalendarTemplateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      path: "/calendar/template",
      method: HttpMethodEnum.POST,
      handlers: [this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get school calendar template",
    });
  }
}
