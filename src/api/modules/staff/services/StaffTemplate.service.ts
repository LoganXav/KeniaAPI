import { autoInjectable } from "tsyringe";
import { StaffEmploymentType } from "@prisma/client";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import RoleReadProvider from "../../role/providers/RoleRead.provider";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";
import CountryConstants from "~/api/shared/helpers/constants/Country.constants";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import NigerianStatesConstant from "~/api/shared/helpers/constants/NigerianStates.constant";
import { GetLgasByCodeValue } from "~/api/shared/helpers/constants/GetLocalGovernmentsByCode";
import ClassDivisionReadProvider from "../../classDivision/providers/ClassDivisionRead.provider";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import EducationLevelOptionsConstant from "~/api/shared/helpers/constants/EducationLevelOptions.constant";

@autoInjectable()
export default class StaffTemplateService extends BaseService<IRequest> {
  static serviceName = "StaffTemplateService";
  loggingProvider: ILoggingDriver;
  roleReadProvider: RoleReadProvider;
  subjectReadProvider: SubjectReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;

  constructor(subjectReadProvider: SubjectReadProvider, classDivisionReadProvider: ClassDivisionReadProvider, roleReadProvider: RoleReadProvider) {
    super(StaffTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.roleReadProvider = roleReadProvider;
    this.subjectReadProvider = subjectReadProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { codeValue } = args.query;

      const subjectOptions = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId });
      const classDivisions = await this.classDivisionReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const classDivisionOptions = classDivisions.map((division) => {
        return {
          ...division,
          name: `${division?.class?.name} ${division?.name}`,
        };
      });

      const roleOptions = await this.roleReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const data = {
        employmentTypeOptions: Object.values(StaffEmploymentType),
        countryIdOptions: CountryConstants,
        stateIdOptions: NigerianStatesConstant,
        lgaIdOptions: GetLgasByCodeValue(Number(codeValue)),
        educationLevelOptions: EducationLevelOptionsConstant,
        subjectOptions,
        classDivisionOptions,
        roleOptions,
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
