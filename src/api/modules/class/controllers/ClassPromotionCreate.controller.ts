import { autoInjectable } from "tsyringe";
import BaseController from "~/api/modules/base/controllers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
// import { validateData } from "~/api/shared/helpers/middleware/validateData";
import ClassPromotionCreateService from "../services/ClassPromotionCreate.service";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
// import { classPromotionCreateSchema } from "~/api/modules/class/validators/ClassPromotionCreateSchema";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { classPromotionCreateSchema } from "../validators/ClassPromotionCreateSchema";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class ClassPromotionCreateController extends BaseController {
  static controllerName: string;
  private classPromotionCreateService: ClassPromotionCreateService;

  constructor(classPromotionCreateService: ClassPromotionCreateService) {
    super();
    this.controllerName = "ClassPromotionCreateController";
    this.classPromotionCreateService = classPromotionCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.classPromotionCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/class/promotion/create",
      handlers: [validateData(classPromotionCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new Class Promotion",
    });
  }
}
