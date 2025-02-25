import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import SubjectDeleteService from "../services/SubjectDelete.service";
import { SubjectDeleteSchema } from "../validators/SubjectDeleteSchema";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SubjectDeleteController extends BaseController {
  static controllerName: string;
  private subjectDeleteService: SubjectDeleteService;

  constructor(subjectDeleteService: SubjectDeleteService) {
    super();
    this.controllerName = "SubjectDeleteController";
    this.subjectDeleteService = subjectDeleteService;
  }

  delete: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectDeleteService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/delete",
      handlers: [validateData(SubjectDeleteSchema), this.delete],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete a subject",
    });
  }
}
