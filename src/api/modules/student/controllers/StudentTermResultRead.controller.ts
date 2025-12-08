import { autoInjectable } from "tsyringe";
import BaseController from "../../base/controllers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import StudentTermResultReadService from "../services/StudentTermResultRead.service";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class StudentTermResultReadController extends BaseController {
  static controllerName: string;
  private studentTermResultReadService: StudentTermResultReadService;
  constructor(StudentTermResultReadService: StudentTermResultReadService) {
    super();
    this.controllerName = "StudentTermResultReadController";
    this.studentTermResultReadService = StudentTermResultReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentTermResultReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/termresult/list",
      handlers: [this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "List of Student Term Results",
    });
  }
}
