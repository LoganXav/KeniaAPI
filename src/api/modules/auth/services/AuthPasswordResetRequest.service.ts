import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export default class AuthPasswordResetRequestService extends BaseService<unknown> {
  static serviceName = "AuthPasswordReserRequestService"
  constructor() {
    super(AuthPasswordResetRequestService.serviceName)
  }
  public async execute(trace: ServiceTrace, args: any): Promise<IResult> {
    return this.result
  }
}
