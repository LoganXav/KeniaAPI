import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import SubjectUpdateService from "../services/SubjectUpdate.service";
import { subjectUpdateSchema } from "../validators/SubjectUpdateSchema";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SubjectUpdateController extends BaseController {
  static controllerName: string;
  private subjectUpdateService: SubjectUpdateService;

  constructor(subjectUpdateService: SubjectUpdateService) {
    super();
    this.controllerName = "SubjectUpdateController";
    this.subjectUpdateService = subjectUpdateService;
  }

  update: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectUpdateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/update/:id",
      handlers: [validateData(subjectUpdateSchema), this.update],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update a subject",
    });
  }
}
