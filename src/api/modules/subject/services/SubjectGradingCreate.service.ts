import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import StaffReadCache from "../../staff/cache/StaffRead.cache";
import { TenantGradingStructure, GradeBoundary } from "@prisma/client";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import StudentReadCache from "~/api/modules/student/cache/StudentRead.cache";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { UnauthorizedError } from "~/infrastructure/internal/exceptions/UnauthorizedError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import SubjectGradingCreateProvider from "~/api/modules/subject/providers/SubjectGradingCreate.provider";
import TenantGradingStructureReadProvider from "~/api/modules/tenant/providers/TenantGradingStructureRead.provider";
import SubjectGradingStructureReadProvider from "~/api/modules/subject/providers/SubjectGradingStructureRead.provider";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, SUBJECT_GRADING_RESOURCE, ERROR, TENANT_GRADING_STRUCTURE_RESOURCE, SUBJECT_GRADING_STRUCTURE_RESOURCE, STUDENT_RESOURCE, STAFF_RESOURCE, AUTHORIZATION_REQUIRED } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class SubjectGradingCreateService extends BaseService<IRequest> {
  static serviceName = "SubjectGradingCreateService";
  private staffReadCache: StaffReadCache;
  private studentReadCache: StudentReadCache;
  private subjectGradingCreateProvider: SubjectGradingCreateProvider;
  private tenantGradingStructureReadProvider: TenantGradingStructureReadProvider;
  private subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider;
  loggingProvider: ILoggingDriver;

  constructor(subjectGradingCreateProvider: SubjectGradingCreateProvider, subjectGradingStructureReadProvider: SubjectGradingStructureReadProvider, tenantGradingStructureReadProvider: TenantGradingStructureReadProvider, studentReadCache: StudentReadCache, staffReadCache: StaffReadCache) {
    super(SubjectGradingCreateService.serviceName);
    this.staffReadCache = staffReadCache;
    this.studentReadCache = studentReadCache;
    this.subjectGradingCreateProvider = subjectGradingCreateProvider;
    this.tenantGradingStructureReadProvider = tenantGradingStructureReadProvider;
    this.subjectGradingStructureReadProvider = subjectGradingStructureReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, studentId, subjectId, classId, continuousAssessmentScores, examScore, userId } = args.body;

      const staff = await this.staffReadCache.getOneByCriteria({ tenantId, id: userId });

      if (!staff) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(STAFF_RESOURCE));
      }

      const isSubjectTeacher = staff.subjects.some((subject) => subject.id === subjectId);

      if (!isSubjectTeacher) {
        throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
      }

      const tenantGradingStructure = await this.tenantGradingStructureReadProvider.getOneByCriteria({ tenantId, classId });

      if (!tenantGradingStructure) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(TENANT_GRADING_STRUCTURE_RESOURCE));
      }

      const subjectGradingStructure = await this.subjectGradingStructureReadProvider.getOneByCriteria({ tenantId, subjectId });

      if (!subjectGradingStructure) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(SUBJECT_GRADING_STRUCTURE_RESOURCE));
      }

      const student = await this.studentReadCache.getOneByCriteria({ id: studentId, tenantId });

      if (!student) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE));
      }

      if (!student.classId || !student.classDivisionId) {
        throw new BadRequestError("Student is not enrolled in a class.");
      }

      const isEnrolled = student.subjects?.some((subject) => subject.id === subjectId);

      if (!isEnrolled) {
        throw new BadRequestError("Student is not enrolled with this subject.");
      }

      this.validateExamAndAssessmentScores(examScore, tenantGradingStructure.examWeight, continuousAssessmentScores, subjectGradingStructure.continuousAssessmentBreakdownItems);

      // Get grade, remark and totalScore
      const { grade, remark, totalScore, totalContinuousScore } = this.mapGradeAndRemark(tenantGradingStructure, continuousAssessmentScores, examScore);

      const subjectGrading = await this.subjectGradingCreateProvider.createOrUpdate({ ...args.body, totalScore, grade, remark, totalContinuousScore, student });

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(SUBJECT_GRADING_RESOURCE), subjectGrading);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
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

  private mapGradeAndRemark(tenantGradingStructure: TenantGradingStructure & { gradeBoundaries: GradeBoundary[] }, continuousAssessmentScores: Array<{ name: string; score: number }>, examScore: number): { grade: string; remark: string; totalScore: number; totalContinuousScore: number } {
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
}
