import { Subject } from "@prisma/client";
import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentReadCache from "~/api/modules/student/cache/StudentRead.cache";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import SubjectGradingReadProvider from "~/api/modules/subject/providers/SubjectGradingRead.provider";
import { ERROR, SUCCESS, STUDENT_GRADING_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class StudentGradingReadService extends BaseService<IRequest> {
  static serviceName = "StudentGradingReadService";
  private studentReadCache: StudentReadCache;
  private subjectGradingReadProvider: SubjectGradingReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(studentReadCache: StudentReadCache, subjectGradingReadProvider: SubjectGradingReadProvider) {
    super(StudentGradingReadService.serviceName);
    this.studentReadCache = studentReadCache;
    this.subjectGradingReadProvider = subjectGradingReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId } = args.body;
      const { calendarId, termId, classId, classDivisionId } = args.query;

      // Get students in the class/division
      const students = await this.studentReadCache.getByCriteria({ classId: Number(classId), tenantId: Number(tenantId), classDivisionId: Number(classDivisionId) });

      // Get all subject gradings for that calendar & term & class
      const subjectGradings = await this.subjectGradingReadProvider.getByCriteria({ calendarId: Number(calendarId), classId: Number(classId), termId: Number(termId), classDivisionId: Number(classDivisionId), ...args.body });

      // Match grades to students
      const studentsWithGrades = students?.map((student) => {
        const studentSubjects = student.subjectsRegistered.map((registration) => {
          const subject = registration.subject;

          const matchedGrading = subjectGradings.find((grade) => grade.subjectId === subject.id && grade.studentId === student.id);

          return {
            subjectId: subject.id,
            name: subject.name,
            grading: matchedGrading
              ? {
                  examScore: matchedGrading.examScore,
                  totalScore: matchedGrading.totalScore,
                  grade: matchedGrading.grade,
                  remark: matchedGrading.remark,
                }
              : null,
          };
        });

        return {
          id: student.id,
          user: student.user,
          classId: student.classId,
          classDivisionId: student.classDivisionId,
          subjects: studentSubjects,
        };
      });

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_GRADING_RESOURCE), studentsWithGrades);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || 500, error.description || "Failed to fetch student grades");
      return this.result;
    }
  }
}
