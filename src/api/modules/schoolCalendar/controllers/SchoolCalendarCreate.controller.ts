import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import SchoolCalendarCreateService from "../services/SchoolCalendarCreate.service";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import { schoolCalendarCreateSchema } from "../validators/SchoolCalendarCreateSchema";

@autoInjectable()
export default class SchoolCalendarCreateController extends BaseController {
  static controllerName: string;
  schoolCalendarCreateService: SchoolCalendarCreateService;

  constructor(schoolCalendarCreateService: SchoolCalendarCreateService) {
    super();
    this.controllerName = "SchoolCalendarCreateController";
    this.schoolCalendarCreateService = schoolCalendarCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.schoolCalendarCreateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      path: "/calendar/create",
      method: HttpMethodEnum.POST,
      handlers: [validateData(schoolCalendarCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new school calendar",
    });
  }
}
