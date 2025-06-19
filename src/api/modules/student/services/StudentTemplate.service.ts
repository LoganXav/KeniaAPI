import { autoInjectable } from "tsyringe";
import StudentReadCache from "../cache/StudentRead.cache";
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
import SchoolCalendarReadProvider from "../../schoolCalendar/providers/SchoolCalendarRead.provider";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import ClassDivisionReadProvider from "~/api/modules/classDivision/providers/ClassDivisionRead.provider";

@autoInjectable()
export default class StudentTemplateService extends BaseService<IRequest> {
  static serviceName = "StudentTemplateService";
  loggingProvider: ILoggingDriver;
  classReadCache: ClassReadCache;
  studentReadCache: StudentReadCache;
  subjectReadProvider: SubjectReadProvider;
  calendarReadProvider: SchoolCalendarReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;

  constructor(classReadCache: ClassReadCache, classDivisionReadProvider: ClassDivisionReadProvider, subjectReadProvider: SubjectReadProvider, calendarReadProvider: SchoolCalendarReadProvider, studentReadCache: StudentReadCache) {
    super(StudentTemplateService.serviceName);
    this.loggingProvider = LoggingProviderFactory.build();
    this.classReadCache = classReadCache;
    this.studentReadCache = studentReadCache;
    this.subjectReadProvider = subjectReadProvider;
    this.calendarReadProvider = calendarReadProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { codeValue, classId, calendarId } = args.query;

      const classOptions = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const classDivisionOptions = await this.classDivisionReadProvider.getByCriteria({
        tenantId: args.body.tenantId,
        classId: Number(classId),
      });

      const subjectOptions = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });

      const calendarOptions = await this.calendarReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const students = await this.studentReadCache.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });

      const studentOptions = students?.map((student) => ({
        ...student,
        subjectsRegistered: student.subjectsRegistered.map((subjectRegistration) => ({
          ...subjectRegistration,
          name: subjectRegistration.subject?.name,
          description: subjectRegistration.subject?.description,
        })),
      }));

      const data = {
        classOptions,
        classDivisionOptions,
        genderOptions: GenderConstants,
        religionOptions: ReligionConstants,
        countryIdOptions: CountryConstants,
        stateIdOptions: NigerianStatesConstant,
        bloodGroupOptions: BloodGroupConstants,
        lgaIdOptions: GetLgasByCodeValue(Number(codeValue)),
        subjectOptions,
        calendarOptions,
        studentOptions,
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
