import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import TimetableDeleteService from "../services/TimetableDelete.service";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { timetableDeleteSchema } from "../validators/TimetableDeleteSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
@autoInjectable()
export default class TimetableDeleteController extends BaseController {
  static controllerName: string;
  private timetableDeleteService: TimetableDeleteService;

  constructor(timetableDeleteService: TimetableDeleteService) {
    super();
    this.controllerName = "TimetableDeleteController";
    this.timetableDeleteService = timetableDeleteService;
  }

  delete: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.timetableDeleteService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      path: "/timetable/delete",
      method: HttpMethodEnum.POST,
      handlers: [validateData(timetableDeleteSchema), this.delete],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete a timetable",
    });
  }
}
