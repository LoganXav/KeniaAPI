import { autoInjectable } from "tsyringe";
import {BaseService} from "../../base/services/Base.service"
import HealthProvider from "../providers/Ping.provider";
import { ServiceTrace } from "../../../../api/shared/helpers/trace/ServiceTrace"
import { IResult } from "../../../../api/shared/helpers/results/IResult"
import AppSettings from "../../../../api/shared/setttings/AppSettings"
import DateTimeUtils from "~/utils/DateTimeUtil"
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";


@autoInjectable()
export default class HelloService extends BaseService<undefined>{
    static serviceName = "HelloService";
    healthProvider: HealthProvider
    constructor(healthProvider: HealthProvider){
        super(HelloService.serviceName)
        this.healthProvider = healthProvider
    }
    public async execute(trace: ServiceTrace): Promise<IResult> {
        this.initializeServiceTrace(trace)

        const message = await this.healthProvider.get(
            AppSettings.ServiceContext,
            DateTimeUtils.getISONow()
        )
        trace.setSuccessful()
        this.result.setMessage(message, HttpStatusCodeEnum.SUCCESS)
        return this.result;
    }
}
