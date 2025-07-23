import { autoInjectable } from "tsyringe";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { StudentSubjectRegistrationCreateRequestType } from "../types/StudentTypes";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import StudentSubjectRegistrationCreateProvider from "~/api/modules/student/providers/StudentSubjectRegistrationCreate.provider";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, ERROR, STUDENT_SUBJECT_REGISTRATION_RESOURCE, SUBJECT_RESOURCE, SOMETHING_WENT_WRONG, STUDENT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class StudentSubjectRegistrationCreateService extends BaseService<IRequest> {
  static serviceName = "StudentSubjectRegistrationCreateService";
  loggingProvider: ILoggingDriver;
  private studentReadCache: StudentReadCache;
  private subjectReadProvider: SubjectReadProvider;
  private studentSubjectRegistrationCreateProvider: StudentSubjectRegistrationCreateProvider;

  constructor(studentSubjectRegistrationCreateProvider: StudentSubjectRegistrationCreateProvider, subjectReadProvider: SubjectReadProvider, studentReadCache: StudentReadCache) {
    super(StudentSubjectRegistrationCreateService.serviceName);
    this.studentReadCache = studentReadCache;
    this.subjectReadProvider = subjectReadProvider;
    this.studentSubjectRegistrationCreateProvider = studentSubjectRegistrationCreateProvider;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, subjectIds, classId, studentId, classDivisionId } = args.body;

      // Get the student and validate class
      const student = await this.studentReadCache.getOneByCriteria({ id: studentId, tenantId });
      if (!student) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE));
      }

      if (student.classId !== classId) {
        throw new BadRequestError("Selected class does not match the student's current class.");
      }

      if (student.classDivisionId !== classDivisionId) {
        throw new BadRequestError("Selected class Division does not match the student's current class.");
      }

      const validSubjects = await this.subjectReadProvider.getByCriteria({ tenantId });
      const validSubjectIds = validSubjects.map((subject) => subject.id);
      const invalidSubjectIds = subjectIds.filter((id: number) => !validSubjectIds.includes(id));

      if (invalidSubjectIds.length > 0) {
        throw new NotFoundError(RESOURCE_RECORD_NOT_FOUND(SUBJECT_RESOURCE));
      }

      const registrations = await this.createSubjectRegistrationsTransaction(args.body);

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.CREATED, RESOURCE_RECORD_CREATED_SUCCESSFULLY(STUDENT_SUBJECT_REGISTRATION_RESOURCE), registrations);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode || HttpStatusCodeEnum.INTERNAL_SERVER_ERROR, error.message);
      return this.result;
    }
  }

  private async createSubjectRegistrationsTransaction(args: StudentSubjectRegistrationCreateRequestType) {
    try {
      const result = await DbClient.$transaction(async (tx: PrismaTransactionClient) => {
        const created = [];

        for (const subjectId of args.subjectIds) {
          const registration = await this.studentSubjectRegistrationCreateProvider.create(
            {
              studentId: args.studentId,
              subjectId,
              calendarId: args.calendarId,
              classId: args.classId,
              classDivisionId: args.classDivisionId,
              tenantId: args.tenantId,
            },
            tx
          );
          created.push(registration);
        }

        return created;
      });

      return result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      throw new InternalServerError(SOMETHING_WENT_WRONG);
    }
  }
}
