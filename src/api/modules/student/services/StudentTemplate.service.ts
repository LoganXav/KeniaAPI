import { autoInjectable } from "tsyringe";
import { Status, SubjectRegistration } from "@prisma/client";
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
import StudentSubjectRegistrationReadProvider from "../providers/StudentSubjectRegistrationRead.provider";

@autoInjectable()
export default class StudentTemplateService extends BaseService<IRequest> {
  static serviceName = "StudentTemplateService";
  loggingProvider: ILoggingDriver;
  classReadCache: ClassReadCache;
  studentReadCache: StudentReadCache;
  subjectReadProvider: SubjectReadProvider;
  calendarReadProvider: SchoolCalendarReadProvider;
  classDivisionReadProvider: ClassDivisionReadProvider;
  studentSubjectRegistrationReadProvider: StudentSubjectRegistrationReadProvider;

  constructor(
    classReadCache: ClassReadCache,
    studentReadCache: StudentReadCache,
    subjectReadProvider: SubjectReadProvider,
    calendarReadProvider: SchoolCalendarReadProvider,
    classDivisionReadProvider: ClassDivisionReadProvider,
    studentSubjectRegistrationReadProvider: StudentSubjectRegistrationReadProvider
  ) {
    super(StudentTemplateService.serviceName);
    this.classReadCache = classReadCache;
    this.studentReadCache = studentReadCache;
    this.subjectReadProvider = subjectReadProvider;
    this.calendarReadProvider = calendarReadProvider;
    this.classDivisionReadProvider = classDivisionReadProvider;
    this.studentSubjectRegistrationReadProvider = studentSubjectRegistrationReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args?.body);
      const { codeValue, classId, calendarId, studentId, classDivisionId } = args.query;

      const classOptions = await this.classReadCache.getByCriteria({ tenantId: args.body.tenantId });
      const classDivisionOptions = await this.classDivisionReadProvider.getByCriteria({
        tenantId: args.body.tenantId,
        classId: Number(classId),
      });

      const calendarOptions = await this.calendarReadProvider.getByCriteria({ tenantId: args.body.tenantId });

      const subjectOptions = await this.subjectReadProvider.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId) });

      const students = await this.studentReadCache.getByCriteria({ tenantId: args.body.tenantId, classId: Number(classId), classDivisionId: Number(classDivisionId) });

      const studentOptions = students?.map((student) => ({
        ...student,
        subjectsRegistered: student.subjectsRegistered.map((subjectRegistration) => ({
          ...subjectRegistration,
          name: subjectRegistration.subject?.name,
          description: subjectRegistration.subject?.description,
        })),
      }));

      let studentSubjectRegistrationOptions: SubjectRegistration[] = [];

      if (studentId && calendarId) {
        studentSubjectRegistrationOptions = await this.studentSubjectRegistrationReadProvider.getByCriteria({
          status: Status.Active,
          classId: Number(classId),
          studentId: Number(studentId),
          tenantId: args.body.tenantId,
          calendarId: Number(calendarId),
        });
      }
      const data = {
        classOptions,
        subjectOptions,
        studentOptions,
        calendarOptions,
        classDivisionOptions,
        genderOptions: GenderConstants,
        studentSubjectRegistrationOptions,
        religionOptions: ReligionConstants,
        countryIdOptions: CountryConstants,
        stateIdOptions: NigerianStatesConstant,
        bloodGroupOptions: BloodGroupConstants,
        lgaIdOptions: GetLgasByCodeValue(Number(codeValue)),
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
