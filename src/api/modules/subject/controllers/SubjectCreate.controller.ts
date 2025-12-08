import { autoInjectable } from "tsyringe";
import BaseController from "../../base/controllers/Base.controller";
import SubjectCreateService from "../services/SubjectCreate.service";
import { subjectCreateSchema } from "../validators/SubjectCreateSchema";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";

@autoInjectable()
export default class SubjectCreateController extends BaseController {
  static controllerName: string;
  private subjectCreateService: SubjectCreateService;

  constructor(subjectCreateService: SubjectCreateService) {
    super();
    this.controllerName = "SubjectCreateController";
    this.subjectCreateService = subjectCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.subjectCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/subject/create",
      handlers: [validateData(subjectCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new subject",
    });
  }
}
