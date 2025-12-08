import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/controllers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { dormitoryDeleteSchema } from "../validators/DormitoryDeleteSchema";
import DormitoryDeleteService from "../services/DormitoryDelete.service";

@autoInjectable()
export default class DormitoryDeleteController extends BaseController {
  static controllerName: string;
  private dormitoryDeleteService: DormitoryDeleteService;

  constructor(dormitoryDeleteService: DormitoryDeleteService) {
    super();
    this.controllerName = "DormitoryDeleteController";
    this.dormitoryDeleteService = dormitoryDeleteService;
  }

  delete: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.dormitoryDeleteService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/dormitory/delete",
      handlers: [validateData(dormitoryDeleteSchema), this.delete],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete a dormitory",
    });
  }
}
