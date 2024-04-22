import AppSettings from "~/api/shared/setttings/AppSettings"
import DateTimeUtils from "~/utils/DateTimeUtil"
import HealthProvider from "../providers/health/Health.provider"
import { Result } from "~/api/shared/helpers/results/Result"
import { BaseService } from "../../base/services/Base.service"
import { IResult } from "~/api/shared/helpers/results/IResult"

class PingService extends BaseService {
  public async execute(): Promise<IResult> {
    const result = new Result()

    const message = await HealthProvider.get(
      AppSettings.ServiceContext,
      DateTimeUtils.getISONow()
    )

    result.setMessage(message, this.applicationStatus.SUCCESS)
    return result
  }
}

export default new PingService()
