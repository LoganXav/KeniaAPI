import AppSettings from "~/api/shared/setttings/AppSettings"
import DateTimeUtils from "~/utils/DateTimeUtil"
import HealthProvider from "../providers/health/Health.provider"
import { Result } from "~/api/shared/helpers/results/Result"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"
import { autoInjectable } from "tsyringe"

@autoInjectable()
export default class PingService extends BaseService<undefined> {
  healthProvider: HealthProvider
  constructor(healthProvider: HealthProvider) {
    super()
    this.healthProvider = healthProvider
  }
  public async execute(): Promise<IResult> {
    const result = new Result()

    const message = await this.healthProvider.get(
      AppSettings.ServiceContext,
      DateTimeUtils.getISONow()
    )

    result.setMessage(message, this.applicationStatus.SUCCESS)
    return result
  }
}
