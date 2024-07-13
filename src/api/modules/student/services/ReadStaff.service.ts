
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import {
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
import StaffReadProvider from "../providers/StaffRead.provider"

@autoInjectable()
export default class ReadStaffService extends BaseService<any> {
  static serviceName = "ReadStaffService"
  staffReadProvider: StaffReadProvider
  loggingProvider: ILoggingDriver

  constructor(staffReadProvider: StaffReadProvider) {
    super(ReadStaffService.serviceName)
    this.staffReadProvider = staffReadProvider
    this.loggingProvider = LoggingProviderFactory.build()
  }

  public async execute(trace: ServiceTrace, args: StaffCriteria): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["readStaff"])
      const staffs = await this.staffReadProvider.getOneByCriteria(args)

      if(staffs){
        trace.setSuccessful()
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.SUCCESS,
          `Get All Staff Information`,
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

  public async getStaffs(trace: ServiceTrace, args: StaffCriteria): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args, ["readStaffs"])
      const staffs = await this.staffReadProvider.getByCriteria(args)

      if(staffs){
        trace.setSuccessful()
        this.result.setData(
          SUCCESS,
          HttpStatusCodeEnum.SUCCESS,
          `Get Staff Information`,
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