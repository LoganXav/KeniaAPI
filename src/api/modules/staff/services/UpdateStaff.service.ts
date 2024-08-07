import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { NOT_FOUND, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { GetAndUpdateStaff } from "../types/StaffTypes";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StaffUpdateProvider from "../providers/StaffUpdate.provider";

@autoInjectable()
export default class UpdateStaffService extends BaseService<any> {
  static serviceName = "UpdateStaffService";
  staffUpdateProvider: StaffUpdateProvider;
  loggingProvider: ILoggingDriver;

  constructor(staffUpdateProvider: StaffUpdateProvider) {
    super(UpdateStaffService.serviceName);
    this.staffUpdateProvider = staffUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: GetAndUpdateStaff): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["updateOneStaff"]);
      const staff = await this.staffUpdateProvider.updateOne(args.criteria, args.data);

      if (staff) {
        trace.setSuccessful();
        this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Staff Update Information`, staff);
        return this.result;
      } else {
        throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async updateStaffs(trace: ServiceTrace, args: GetAndUpdateStaff): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["updateStaffs"]);
      const staffs = await this.staffUpdateProvider.updateMany(args.criteria, args.data);

      if (staffs) {
        trace.setSuccessful();
        this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Updated Staffs Information`, staffs);
        return this.result;
      } else {
        throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async removeListFromStaff(trace: ServiceTrace, args: GetAndUpdateStaff): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["removeListFromStaff"]);
      const staff = await this.staffUpdateProvider.removeListFromStaff(args.criteria, args.data);

      if (staff) {
        trace.setSuccessful();
        this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Updated Staffs Information`, staff);
        return this.result;
      } else {
        throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
