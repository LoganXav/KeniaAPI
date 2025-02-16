import { EntryPointHandler, INextFunction, IRequest, IResponse, IRouter } from "~/infrastructure/internal/types";
import BaseController from "../../base/contollers/Base.controller";
import { HttpMethodEnum } from "~/api/shared/helpers/enums/HttpMethod.enum";
import ApplicationStatusEnum from "~/api/shared/helpers/enums/ApplicationStatus.enum";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { HttpHeaderEnum } from "~/api/shared/helpers/enums/HttpHeader.enum";
import { HttpContentTypeEnum } from "~/api/shared/helpers/enums/HttpContentType.enum";
import { autoInjectable } from "tsyringe";
import { validateData } from "~/api/shared/helpers/middleware/validateData";
import { medicalHistoryDeleteSchema } from "../validators/MedicalHistoryDeleteSchema";
import MedicalHistoryDeleteService from "../services/MedicalHistoryDelete.service";

@autoInjectable()
export default class MedicalHistoryDeleteController extends BaseController {
  static controllerName: string;
  private medicalHistoryDeleteService: MedicalHistoryDeleteService;

  constructor(medicalHistoryDeleteService: MedicalHistoryDeleteService) {
    super();
    this.controllerName = "MedicalHistoryDeleteController";
    this.medicalHistoryDeleteService = medicalHistoryDeleteService;
  }

  delete: EntryPointHandler = async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
    return this.handleResultData(res, next, this.medicalHistoryDeleteService.execute(res.trace, req.body), {
      [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON,
    });
  };

  public initializeRoutes(router: IRouter): void {
    this.setRouter(router());

    this.addRoute({
      method: HttpMethodEnum.POST,
      path: "/medicalhistory/delete",
      handlers: [validateData(medicalHistoryDeleteSchema), this.delete],
      produces: [
        {
          applicationStatus: ApplicationStatusEnum.SUCCESS,
          httpStatus: HttpStatusCodeEnum.SUCCESS,
        },
      ],
      description: "Delete a medical history",
    });
  }
}
