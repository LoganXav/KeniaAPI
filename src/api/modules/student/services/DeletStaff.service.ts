
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import {
    DELETE_ERROR,
  NOT_FOUND,
  SUCCESS,
} from "~/api/shared/helpers/messages/SystemMessages"
import { autoInjectable } from "tsyringe"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum"
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver"
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory"
import { StaffCriteria } from "../types/StaffTypes"
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages"
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError"
import StaffDeleteProvider from "../providers/StaffDelete.provider"

@autoInjectable()
export default class DeleteStaffService extends BaseService<any> {
  static serviceName = "DeleteStaffService"
  staffDeleteProvider: StaffDeleteProvider
  loggingProvider: ILoggingDriver

  constructor(staffDeleteProvider: StaffDeleteProvider) {
    super(DeleteStaffService.serviceName)
    this.staffDeleteProvider = staffDeleteProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public async execute(trace: ServiceTrace, args: StaffCriteria): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["deleteStaff"])
      const staff = await this.staffDeleteProvider.deleteOne(args)

      if(staff){
        trace.setSuccessful()
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.SUCCESS,
          `Delete Staff Information!!!`,
          staff
        )
        return this.result
      } else {
        throw new BadRequestError(`${DELETE_ERROR}`)
      }

    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(ERROR, error.httpStatusCode, error.description)
      return this.result
    }
  }

  public async deleteStaffs(trace: ServiceTrace, args: StaffCriteria): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["deleteStaffs"])
      const staffs = await this.staffDeleteProvider.deleteMany(args)

      if(staffs){
        trace.setSuccessful()
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.SUCCESS,
          `Delete Staffs Information`,
          staffs
        )
        return this.result
      } else {
        throw new BadRequestError(`Staff ${NOT_FOUND}`, HttpStatusCodeEnum.NOT_FOUND)
      }

    } catch (error: any) {
      this.loggingProvider.error(error)
      this.result.setError(ERROR, error.httpStatusCode, error.description)
      return this.result
    }
  }
}