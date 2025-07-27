import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentReadCache from "~/api/modules/student/cache/StudentRead.cache";
import { SubjectGradingCreateRequestType } from "../types/SubjectGradingTypes";
import { StudentWithRelationsSafeUser } from "../../student/types/StudentTypes";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import SubjectGradingReadProvider from "../providers/SubjectGradingRead.provider";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { NormalizedAppError } from "~/infrastructure/internal/exceptions/NormalizedAppError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import StudentTermResultReadProvider from "../../student/providers/StudentTermResultRead.provider";
import StudentTermResultCreateProvider from "../../student/providers/StudentTermResultCreateProvider";
import StudentTermResultUpdateProvider from "../../student/providers/StudentTermResultUpdate.provider";
import SubjectGradingCreateProvider from "~/api/modules/subject/providers/SubjectGradingCreate.provider";
import TenantGradingStructureReadProvider from "~/api/modules/tenant/providers/TenantGradingStructureRead.provider";
import StudentSubjectRegistrationReadProvider from "../../student/providers/StudentSubjectRegistrationRead.provider";
import SubjectGradingStructureReadProvider from "~/api/modules/subject/providers/SubjectGradingStructureRead.provider";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { TenantGradingStructure, GradeBoundary, Status, Student, SubjectGradingStructure, ContinuousAssessmentBreakdownItem } from "@prisma/client";
import { SUCCESS, SUBJECT_GRADING_RESOURCE, ERROR, TENANT_GRADING_STRUCTURE_RESOURCE, SUBJECT_GRADING_STRUCTURE_RESOURCE, STUDENT_RESOURCE, STAFF_RESOURCE, AUTHORIZATION_REQUIRED } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class SubjectGradingCreateService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingCreateService";
  private staffReadCache: StaffReadCache;
  private studentReadCache: StudentReadCache;
  private subjectGradingReadProvider: SubjectGradingReadProvider;
  private subjectGradingCreateProvider: SubjectGradingCreateProvider;
  private studentTermResultReadProvider: StudentTermResultReadProvider;
  private studentTermResultUpdateProvider: StudentTermResultUpdateProvider;
  private studentTermResultCreateProvider: StudentTermResultCreateProvider;
  private tenantGradingStructureReadProvider: TenantGradingStructureReadProvider;
  private subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider;
  private studentSubjectRegistrationReadProvider: StudentSubjectRegistrationReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(
    staffReadCache: StaffReadCache,
    studentReadCache: StudentReadCache,
    subjectGradingReadProvider: SubjectGradingReadProvider,
    subjectGradingCreateProvider: SubjectGradingCreateProvider,
    studentTermResultReadProvider: StudentTermResultReadProvider,
    studentTermResultCreateProvider: StudentTermResultCreateProvider,
    studentTermResultUpdateProvider: StudentTermResultUpdateProvider,
    tenantGradingStructureReadProvider: TenantGradingStructureReadProvider,
    subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider,
    studentSubjectRegistrationReadProvider: StudentSubjectRegistrationReadProvider
  ) {
    super(SubjectGradingCreateService.serviceName);
    this.staffReadCache = staffReadCache;
    this.studentReadCache = studentReadCache;
    this.subjectGradingReadProvider = subjectGradingReadProvider;
    this.subjectGradingCreateProvider = subjectGradingCreateProvider;
    this.studentTermResultReadProvider = studentTermResultReadProvider;
    this.studentTermResultUpdateProvider = studentTermResultUpdateProvider;
    this.studentTermResultCreateProvider = studentTermResultCreateProvider;
    this.tenantGradingStructureReadProvider = tenantGradingStructureReadProvider;
    this.subjectGradingStructureReadProvider = subjectGradingStructureReadProvider;
    this.studentSubjectRegistrationReadProvider = studentSubjectRegistrationReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, calendarId, termId, studentId, subjectId, classId, continuousAssessmentScores, examScore, userId } = args.body;

      // await this.validateSubjectTeacher(tenantId, userId, subjectId);
      const tenantGradingStructure = await this.getTenantGradingStructure(tenantId, classId);
      const subjectGradingStructure = await this.getSubjectGradingStructure(tenantId, subjectId);
      const student = await this.getValidatedStudentWithSubjectEnrollment(tenantId, studentId, subjectId);
      this.validateExamAndAssessmentScores(examScore, tenantGradingStructure.examWeight, continuousAssessmentScores, subjectGradingStructure.continuousAssessmentBreakdownItems);

      // Get grade, remark and totalScore
      const { grade, remark, totalScore, totalContinuousScore } = this.mapGradeAndRemarkWithGradingStructure(tenantGradingStructure, continuousAssessmentScores, examScore);

      const subjectGrading = await this.subjectGradingCreateProvider.createOrUpdate({ ...args.body, totalScore, grade, remark, totalContinuousScore, student });

      // Update student's term results
      await this.createOrUpdateStudentTermResult({
        studentId,
        tenantId,
        calendarId,
        termId,
        subjectId,
        newlyAddedScore: totalScore,
      });

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SUBJECT_GRADING_RESOURCE), subjectGrading);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  public async createBulk(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, subjectId, calendarId, termId, grades, classId, userId } = args.body;

      await this.validateSubjectTeacher(tenantId, userId, subjectId);
      const tenantGradingStructure = await this.getTenantGradingStructure(tenantId, classId);
      const subjectGradingStructure = await this.getSubjectGradingStructure(tenantId, subjectId);
      const { studentsMap, studentsById } = await this.validateAndMapStudentsByAdmissionNo(tenantId, grades);
      await this.validateBulkStudentsAreRegisteredForSubject(studentsMap, {
        classId,
        subjectId,
        calendarId,
        tenantId,
      });

      const gradingInputs = grades.map((gradeEntry: { admissionNo: string; examScore: number; continuousAssessmentScores: Array<{ name: string; score: number }> }) => {
        const studentId = studentsMap.get(gradeEntry.admissionNo);
        const student = studentId ? studentsById.get(studentId) : null;

        this.validateExamAndAssessmentScores(gradeEntry.examScore, tenantGradingStructure.examWeight, gradeEntry.continuousAssessmentScores, subjectGradingStructure.continuousAssessmentBreakdownItems);

        const { grade, remark, totalScore, totalContinuousScore } = this.mapGradeAndRemarkWithGradingStructure(tenantGradingStructure, gradeEntry.continuousAssessmentScores, gradeEntry.examScore);

        return {
          grade,
          termId,
          remark,
          student,
          tenantId,
          subjectId,
          calendarId,
          totalScore,
          totalContinuousScore,
          studentId: student?.id,
          examScore: gradeEntry.examScore,
          continuousAssessmentScores: gradeEntry.continuousAssessmentScores,
        };
      });

      await Promise.all(
        gradingInputs.map((input: SubjectGradingCreateRequestType) =>
          this.createOrUpdateStudentTermResult({
            termId,
            calendarId,
            tenantId,
            subjectId,
            studentId: input.subjectId,
            newlyAddedScore: input.totalScore,
          })
        )
      );

      const createdRecords = await Promise.all(gradingInputs.map((input: SubjectGradingCreateRequestType) => this.subjectGradingCreateProvider.createOrUpdate(input)));

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SUBJECT_GRADING_RESOURCE), createdRecords);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  private mapGradeAndRemarkWithGradingStructure(
    tenantGradingStructure: TenantGradingStructure & { gradeBoundaries: GradeBoundary[] },
    continuousAssessmentScores: Array<{ name: string; score: number }>,
    examScore: number
  ): { grade: string; remark: string; totalScore: number; totalContinuousScore: number } {
    const totalContinuousScore = continuousAssessmentScores.reduce((acc, cur) => acc + cur.score, 0);

    const weightedTotalScore = totalContinuousScore + examScore;

    const sortedBoundaries = tenantGradingStructure.gradeBoundaries.sort((a, b) => a.minimumScore - b.minimumScore);

    const gradeBoundary = sortedBoundaries.find((boundary: GradeBoundary) => weightedTotalScore >= boundary.minimumScore && weightedTotalScore < boundary.maximumScore) || sortedBoundaries.find((boundary: GradeBoundary) => weightedTotalScore === boundary.maximumScore);

    return {
      grade: gradeBoundary?.grade ?? "N/A",
      remark: gradeBoundary?.remark ?? "No remark available",
      totalScore: weightedTotalScore,
      totalContinuousScore,
    };
  }

  private async getSubjectGradingStructure(tenantId: number, subjectId: number): Promise<SubjectGradingStructure & { continuousAssessmentBreakdownItems: ContinuousAssessmentBreakdownItem[] }> {
    try {
      const structure = await this.subjectGradingStructureReadProvider.getOneByCriteria({ tenantId, subjectId });
      if (!structure) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(SUBJECT_GRADING_STRUCTURE_RESOURCE));
      }
      return structure;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }

  private async getTenantGradingStructure(
    tenantId: number,
    classId: number
  ): Promise<
    TenantGradingStructure & {
      gradeBoundaries: GradeBoundary[];
    }
  > {
    try {
      const structure = await this.tenantGradingStructureReadProvider.getOneByCriteria({ tenantId, classId });
      if (!structure) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(TENANT_GRADING_STRUCTURE_RESOURCE));
      }
      return structure;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }

  private async getValidatedStudentWithSubjectEnrollment(tenantId: number, studentId: number, subjectId: number): Promise<Student> {
    try {
      const student = await this.studentReadCache.getOneByCriteria({ id: studentId, tenantId });

      if (!student) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE));
      }

      if (!student.classId || !student.classDivisionId) {
        throw new BadRequestError("Student is not enrolled in a class.");
      }

      const isEnrolled = student.subjectsRegistered?.some((reg) => reg.subject.id === subjectId);

      if (!isEnrolled) {
        throw new BadRequestError("Student is not enrolled with this subject.");
      }

      return student;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }

  private async validateBulkStudentsAreRegisteredForSubject(
    studentsMap: Map<string | null, number>,
    args: {
      classId: number;
      subjectId: number;
      calendarId: number;
      tenantId: number;
    }
  ): Promise<void> {
    try {
      const studentIds = Array.from(studentsMap.values());

      const subjectRegistrations = await this.studentSubjectRegistrationReadProvider.getByCriteria({
        classId: args.classId,
        studentIds,
        subjectId: args.subjectId,
        calendarId: args.calendarId,
        tenantId: args.tenantId,
        status: Status.Active,
      });

      const registeredStudentIds = new Set(subjectRegistrations.map((reg) => reg.studentId));

      const unregisteredAdmissionNos = [...studentsMap.entries()].filter(([_, studentId]) => !registeredStudentIds.has(studentId)).map(([admissionNo]) => admissionNo);

      if (unregisteredAdmissionNos.length > 0) {
        throw new BadRequestError(`Students with admission numbers ${unregisteredAdmissionNos.join(", ")} are not currently registered for the subject.`);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }

  private async validateSubjectTeacher(tenantId: number, userId: number, subjectId: number): Promise<void> {
    try {
      const staff = await this.staffReadCache.getOneByCriteria({ tenantId, id: userId });

      if (!staff) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE));
      }

      const isSubjectTeacher = staff.subjects.some((subject) => subject.id === subjectId);

      if (!isSubjectTeacher) {
        throw new BadRequestError(AUTHORIZATION_REQUIRED);
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }

  private validateExamAndAssessmentScores(examScore: number, examWeight: number, assessmentScores: Array<{ name: string; score: number }>, breakdownItems: Array<{ name: string; weight: number }>): void {
    if (examScore > examWeight) {
      throw new BadRequestError(`Exam score cannot be more than its expected weight ${examWeight}`);
    }

    const breakdownMap = new Map<string, number>();
    for (const item of breakdownItems) {
      breakdownMap.set(item.name, item.weight);
    }

    for (const scoreEntry of assessmentScores) {
      const expectedWeight = breakdownMap.get(scoreEntry.name);
      if (expectedWeight === undefined) {
        throw new BadRequestError(`Unexpected continuous assessment item: '${scoreEntry.name}'.`);
      }

      if (scoreEntry.score > expectedWeight) {
        throw new BadRequestError(`${scoreEntry.name} score (${scoreEntry.score}) cannot exceed its weight (${expectedWeight}).`);
      }
    }

    const providedNames = assessmentScores.map((s) => s.name).sort();
    const expectedNames = Array.from(breakdownMap.keys()).sort();

    if (providedNames.length !== expectedNames.length || !providedNames.every((val, index) => val === expectedNames[index])) {
      throw new BadRequestError(`Continuous assessment items must match exactly: [${expectedNames.join(", ")}].`);
    }
  }

  private async validateAndMapStudentsByAdmissionNo(
    tenantId: number,
    grades: { admissionNo: string }[]
  ): Promise<{
    studentsMap: Map<string, number>;
    studentsById: Map<number, StudentWithRelationsSafeUser>;
  }> {
    try {
      const studentsMap = new Map<string, number>();
      const studentsById = new Map<number, StudentWithRelationsSafeUser>();
      const admissionNos = grades.map((g) => g.admissionNo);
      const students = await this.studentReadCache.getByCriteria({ tenantId, admissionNos });

      for (const student of students) {
        if (student.admissionNo) {
          studentsMap.set(student.admissionNo, student.id);
          studentsById.set(student.id, student);
        }
      }

      if (studentsMap.size !== admissionNos.length) {
        const missing = admissionNos.filter((adm) => !studentsMap.has(adm));
        throw new BadRequestError(`Students with admission numbers ${missing.join(", ")} not found.`);
      }

      return { studentsMap, studentsById };
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error);
    }
  }

  private async createOrUpdateStudentTermResult({ studentId, tenantId, calendarId, termId, subjectId, newlyAddedScore }: { studentId: number; tenantId: number; calendarId: number; termId: number; subjectId: number; newlyAddedScore: number }): Promise<void> {
    try {
      // fetch existing term result
      const existing = await this.studentTermResultReadProvider.getOneByCriteria({ studentId, termId, tenantId });

      if (existing?.finalized) {
        throw new BadRequestError("Cannot update this student's result as it has already been finalized.");
      }

      // check if this subject was already graded
      const prior = await this.subjectGradingReadProvider.getOneByCriteria({ studentId, subjectId, calendarId, termId, tenantId });
      const incrementCount = prior ? 0 : 1;

      if (existing) {
        const newTotal = existing.totalScore + newlyAddedScore;
        const newCount = existing.subjectCountGraded + incrementCount;
        const newAvg = newCount > 0 ? newTotal / newCount : 0;

        await this.studentTermResultUpdateProvider.update({
          studentId,
          termId,
          tenantId,
          totalScore: newTotal,
          averageScore: newAvg,
          subjectCountGraded: newCount,
        });
      } else {
        // count offered subjects
        const offered = await this.studentSubjectRegistrationReadProvider.count({
          studentId,
          calendarId,
          tenantId,
          status: Status.Active,
        });

        await this.studentTermResultCreateProvider.create({
          studentId,
          termId,
          tenantId,
          totalScore: newlyAddedScore,
          averageScore: newlyAddedScore,
          subjectCountGraded: 1,
          subjectCountOffered: offered,
          finalized: false,
        });
      }
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new NormalizedAppError(error.message);
    }
  }
}
