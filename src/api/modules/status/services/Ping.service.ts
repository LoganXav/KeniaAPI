import AppSettings from "~/api/shared/setttings/AppSettings";
import DateTimeUtils from "~/utils/DateTimeUtil";
import HealthProvider from "../providers/health/Health.provider";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";

@autoInjectable()
export default class PingService extends BaseService<undefined> {
  static serviceName = "PingService";
  healthProvider: HealthProvider;
  constructor(healthProvider: HealthProvider) {
    super(PingService.serviceName);
    this.healthProvider = healthProvider;
  }
  public async execute(trace: ServiceTrace): Promise<IResult> {
    this.initializeServiceTrace(trace);

    const message = await this.healthProvider.get(AppSettings.ServiceContext, DateTimeUtils.getISONow());
    trace.setSuccessful();
    this.result.setMessage(message, HttpStatusCodeEnum.SUCCESS);
    return this.result;
  }
}
