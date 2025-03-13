import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import SchoolCalendarDeleteService from "../services/SchoolCalendarDelete.service";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { schoolCalendarDeleteSchema } from "../validators/SchoolCalendarDeleteSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SchoolCalendarDeleteController extends BaseController {
  static controllerName: string;
  schoolCalendarDeleteService: SchoolCalendarDeleteService;

  constructor(schoolCalendarDeleteService: SchoolCalendarDeleteService) {
    super();
    this.controllerName = "SchoolCalendarDeleteController";
    this.schoolCalendarDeleteService = schoolCalendarDeleteService;
  }

  delete: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.schoolCalendarDeleteService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      path: "/school-calendar/delete",
      method: HttpMethodEnum.POST,
      handlers: [validateData(schoolCalendarDeleteSchema), this.delete],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete a school calendar",
    });
  }
}
