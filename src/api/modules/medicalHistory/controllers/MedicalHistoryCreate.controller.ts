import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { medicalHistoryCreateSchema } from "../validators/MedicalHistoryCreateSchema";
import MedicalHistoryCreateService from "../services/MedicalHistoryCreate.service";

@autoInjectable()
export default class MedicalHistoryCreateController extends BaseController {
  static controllerName: string;
  private medicalHistoryCreateService: MedicalHistoryCreateService;

  constructor(medicalHistoryCreateService: MedicalHistoryCreateService) {
    super();
    this.controllerName = "MedicalHistoryCreateController";
    this.medicalHistoryCreateService = medicalHistoryCreateService;
  }

  create: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.medicalHistoryCreateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/medicalhistory/create",
      handlers: [validateData(medicalHistoryCreateSchema), this.create],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.CREATED,
        },
      ],
      description: "Create a new medical history",
    });
  }
}
