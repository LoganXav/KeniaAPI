import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import ClassReadCache from "~/api/modules/class/cache/ClassRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import GenderConstants from "~/api/shared/helpers/constants/Gender.constants";
import CountryConstants from "~/api/shared/helpers/constants/Country.constants";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import ReligionConstants from "~/api/shared/helpers/constants/Religion.constants";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import BloodGroupConstants from "~/api/shared/helpers/constants/BloodGroup.constants";
import SubjectReadProvider from "~/api/modules/subject/providers/SubjectRead.provider";
import NigerianStatesConstant from "~/api/shared/helpers/constants/NigerianStates.constant";
import { GetLgasByCodeValue } from "~/api/shared/helpers/constants/GetLocalGovernmentsByCode";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR, SUCCESS, TEMPLATE_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import ClassDivisionReadProvider from "~/api/modules/classDivision/providers/ClassDivisionRead.provider";
@autoInjectable()
export default class StudentTemplateService extends BaseService<IRequest> {
  static serviceName = "StudentTemplateService";
  loggingProvider: ILoggingDriver;
  classReadCache: ClassReadCache;
  classDivisionReadProvider: ClassDivisionReadProvider;
  subjectReadProvider: SubjectReadProvider;

  constructor(classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider, subjectReadProvider: SubjectReadProvider) {
    super(StudentTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.classReadCache = classReadCache;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.subjectReadProvider = subjectReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { codeValue, classId } = args.query;

      const classes = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const classDivision = await this.classDivisionReadProvider.getByCriteria({
        tenantId: args.body.tenantId,
        classId: Number(classId),
      });

      const subjects = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });

      const data = {
        classOptions: classes,
        classDivisionOptions: classDivision,
        genderOptions: GenderConstants,
        religionOptions: ReligionConstants,
        countryIdOptions: CountryConstants,
        stateIdOptions: NigerianStatesConstant,
        bloodGroupOptions: BloodGroupConstants,
        lgaIdOptions: GetLgasByCodeValue(Number(codeValue)),
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
