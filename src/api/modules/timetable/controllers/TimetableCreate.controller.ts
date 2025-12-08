import { autoInjectable } from "tsyringe";
import BaseController from "../../base/controllers/Base.controller";
import TimetableCreateService from "../services/TimetableCreate.service";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { timetableCreateOrUpdateSchema } from "../validators/TimetableCreateSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class TimetableCreateController extends BaseController {
  static controllerName: string;
  private timetableCreateService: TimetableCreateService;

  constructor(timetableCreateService: TimetableCreateService) {
    super();
    this.controllerName = "TimetableCreateController";
    this.timetableCreateService = timetableCreateService;
  }

  createOrUpdate: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.timetableCreateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/timetable/create",
      handlers: [validateData(timetableCreateOrUpdateSchema), this.createOrUpdate],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new timetable",
    });
  }
}
