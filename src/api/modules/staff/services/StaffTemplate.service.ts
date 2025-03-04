import { autoInjectable } from "tsyringe";
import { StaffEmploymentType } from "@prisma/client";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import CountryConstants from "~/api/shared/helpers/constants/Country.constants";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import NigerianStatesConstant from "~/api/shared/helpers/constants/NigerianStates.constant";
import { GetLgasByCodeValue } from "~/api/shared/helpers/constants/GetLocalGovernmentsByCode";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import EducationLevelOptionsConstant from "~/api/shared/helpers/constants/EducationLevelOptions.constant";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";

@autoInjectable()
export default class StaffTemplateService extends BaseService<IRequest> {
  static serviceName = "StaffTemplateService";
  loggingProvider: ILoggingDriver;
  subjectReadProvider: SubjectReadProvider;
  constructor(subjectReadProvider: SubjectReadProvider) {
    super(StaffTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.subjectReadProvider = subjectReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { codeValue } = args.query;

      const subjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const data = {
        employmentTypeOptions: Object.values(StaffEmploymentType),
        countryIdOptions: CountryConstants,
        stateIdOptions: NigerianStatesConstant,
        lgaIdOptions: GetLgasByCodeValue(Number(codeValue)),
        educationLevelOptions: EducationLevelOptionsConstant,
        subjectOptions: subjects,
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
