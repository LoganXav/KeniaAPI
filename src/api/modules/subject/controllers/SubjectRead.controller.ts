import { autoInjectable } from "tsyringe";
import SubjectReadService from "../services/SubjectRead.service";
import BaseController from "../../base/contollers/Base.controller";
import { subjectReadSchema } from "../validators/SubjectReadSchema";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SubjectReadController extends BaseController {
  static controllerName: string;
  private subjectReadService: SubjectReadService;

  constructor(subjectReadService: SubjectReadService) {
    super();
    this.controllerName = "SubjectReadController";
    this.subjectReadService = subjectReadService;
  }

  read: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  readOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectReadService.readOne(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/list",
      handlers: [validateData(subjectReadSchema), this.read],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get all subjects",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/info/:id",
      handlers: [validateData(subjectReadSchema), this.readOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get a single subject",
    });
  }
}
