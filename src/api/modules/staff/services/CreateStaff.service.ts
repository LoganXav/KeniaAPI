import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { CREATED, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StaffCreateProvider from "../providers/StaffCreate.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { CreateStaffData } from "../types/StaffTypes";
import { CREATE_ERROR, ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";

@autoInjectable()
export default class CreateStaffService extends BaseService<any> {
  static serviceName = "CreateStaffService";
  staffCreateProvider: StaffCreateProvider;
  loggingProvider: ILoggingDriver;

  constructor(staffCreateProvider: StaffCreateProvider) {
    super(CreateStaffService.serviceName);
    this.staffCreateProvider = staffCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: CreateStaffData): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["createStaff"]);
      const createdStaff = await this.staffCreateProvider.createStaff(args);

      if (createdStaff) {
        trace.setSuccessful();
        this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Staff ${CREATED}`, createdStaff);
        return this.result;
      } else {
        throw new BadRequestError(`${CREATE_ERROR} Staff`);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
