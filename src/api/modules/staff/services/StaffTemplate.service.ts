import { autoInjectable } from "tsyringe";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { IRequest } from "~/infrastructure/internal/types";
import NigerianStatesConstant from "~/api/shared/helpers/constants/NigerianStates.constant";
import CountryConstants from "~/api/shared/helpers/constants/Country.constants";
import { GetLgasByCodeValue } from "~/api/shared/helpers/constants/GetLocalGovernmentsByCode";
import { StaffEmploymentType } from "@prisma/client";
import EducationLevelOptionsConstant from "~/api/shared/helpers/constants/EducationLevelOptions.constant";

@autoInjectable()
export default class StaffTemplateService extends BaseService<IRequest> {
  static serviceName = "StaffTemplateService";
  loggingProvider: ILoggingDriver;
  constructor() {
    super(StaffTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { codeValue } = args.query;

      const data = {
        employmentTypeOptions: Object.values(StaffEmploymentType),
        countryIdOptions: CountryConstants,
        stateIdOptions: NigerianStatesConstant,
        lgaIdOptions: GetLgasByCodeValue(Number(codeValue)),
        educationLevelOptions: EducationLevelOptionsConstant,
      };

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(TEMPLATE_RESOURCE), data);
      trace.setSuccessful();
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
