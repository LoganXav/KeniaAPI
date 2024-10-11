import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { STAFF_RESOURCE, SUCCESS } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StaffUpdateProvider from "../providers/StaffUpdate.provider";
import { StaffUpdateManyRequestType, StaffUpdateRequestType } from "../types/StaffTypes";
import StaffReadProvider from "../providers/StaffRead.provider";
import { RESOURCE_RECORD_NOT_FOUND, RESOURCE_RECORD_UPDATED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StaffUpdateService extends BaseService<any> {
  static serviceName = "StaffUpdateService";
  staffUpdateProvider: StaffUpdateProvider;
  staffReadProvider: StaffReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(staffUpdateProvider: StaffUpdateProvider, staffReadProvider: StaffReadProvider) {
    super(StaffUpdateService.serviceName);
    this.staffReadProvider = staffReadProvider;
    this.staffUpdateProvider = staffUpdateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: StaffUpdateRequestType & { id: string }): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundStaff = await this.staffReadProvider.getOneByCriteria({ id: Number(args.id) });

      if (!foundStaff) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      const staff = await this.staffUpdateProvider.updateOne(args);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_RECORD_UPDATED_SUCCESSFULLY(STAFF_RESOURCE), staff);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async updateMany(trace: ServiceTrace, args: StaffUpdateManyRequestType): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args);

      const foundStaffs = await this.staffReadProvider.getByCriteria({ ids: args.ids });

      if (!foundStaffs.length) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      const staffs = await this.staffUpdateProvider.updateMany(args);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Updated Staffs Information`, staffs);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  // public async removeListFromStaff(trace: ServiceTrace, args: GetAndUpdateStaff): Promise<IResult> {
  //   try {
  //     this.initializeServiceTrace(trace, args, ["removeListFromStaff"]);
  //     const staff = await this.staffUpdateProvider.removeListFromStaff(args.criteria, args.data);

  //     if (staff) {
  //       trace.setSuccessful();
  //       this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, `Updated Staffs Information`, staff);
  //       return this.result;
  //     } else {
  //       throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND);
  //     }
  //   } catch (error: any) {
  //     this.loggingProvider.error(error);
  //     this.result.setError(ERROR, error.httpStatusCode, error.description);
  //     return this.result;
  //   }
  // }
}
