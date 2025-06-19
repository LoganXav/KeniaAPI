import { autoInjectable } from "tsyringe";
import BaseController from "../../base/contollers/Base.controller";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
// import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import StudentSubjectRegistrationCreateService from "../services/StudentSubjectRegistrationCreate.service";
import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
// import { studentSubjectRegistrationCreateRequestSchema } from "../validators/StudentSubjectRegistrationCreateSchema";

@autoInjectable()
export default class StudentSubjectRegistrationCreateController extends BaseController {
  static controllerName: string;
  private studentSubjectRegistrationCreateService: StudentSubjectRegistrationCreateService;
  constructor(StudentSubjectRegistrationCreateService: StudentSubjectRegistrationCreateService) {
    super();
    this.controllerName = "StudentSubjectRegistrationCreateController";
    this.studentSubjectRegistrationCreateService = StudentSubjectRegistrationCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.studentSubjectRegistrationCreateService.execute(res.trace, req), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/student/subjectregistration/create",
      handlers: [this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.CREATED,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Register Student Subjects",
    });
  }
}
