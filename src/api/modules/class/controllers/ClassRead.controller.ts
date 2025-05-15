import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import ClassReadService from "~/api/modules/class/services/ClassRead.service";
import { classReadSchema } from "~/api/modules/class/validators/ClassReadSchema";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class ClassReadController extends BaseController {
  static controllerName: string;
  private classReadService: ClassReadService;

  constructor(classReadService: ClassReadService) {
    super();
    this.controllerName = "ClassReadController";
    this.classReadService = classReadService;
  }

  getAll: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.classReadService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  getOne: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.classReadService.readOne(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/class/list",
      handlers: [validateData(classReadSchema), this.getAll],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get all classes",
    });

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/class/info/:id",
      handlers: [validateData(classReadSchema), this.getOne],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Get a single class",
    });
  }
}
