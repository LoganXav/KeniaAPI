import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { medicalHistoryUpdateSchema } from "../validators/MedicalHistoryUpdateSchema";
import MedicalHistoryUpdateService from "../services/MedicalHistoryUpdate.service";

@autoInjectable()
export default class MedicalHistoryUpdateController extends BaseController {
  static controllerName: string;
  private medicalHistoryUpdateService: MedicalHistoryUpdateService;

  constructor(medicalHistoryUpdateService: MedicalHistoryUpdateService) {
    super();
    this.controllerName = "MedicalHistoryUpdateController";
    this.medicalHistoryUpdateService = medicalHistoryUpdateService;
  }

  update: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.medicalHistoryUpdateService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/medicalhistory/update",
      handlers: [validateData(medicalHistoryUpdateSchema), this.update],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Update a medical history",
    });
  }
}
