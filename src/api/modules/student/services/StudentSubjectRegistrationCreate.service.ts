import { autoInjectable } from "tsyringe";
import { IRequest } from "~/infrastructure/internal/types";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { BaseService } from "~/api/modules/base/services/Base.service";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import SubjectReadProvider from "../../subject/providers/SubjectRead.provider";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { NotFoundError } from "~/infrastructure/internal/exceptions/NotFoundError";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { StudentSubjectRegistrationCreateRequestType } from "../types/StudentTypes";
import DbClient, { PrismaTransactionClient } from "~/infrastructure/internal/database";
import { InternalServerError } from "~/infrastructure/internal/exceptions/InternalServerError";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import StudentSubjectRegistrationDeleteProvider from "../providers/StudentSubjectRegistrationDelete.provider";
import StudentSubjectRegistrationCreateProvider from "~/api/modules/student/providers/StudentSubjectRegistrationCreate.provider";
import { RESOURCE_RECORD_CREATED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import { SUCCESS, ERROR, STUDENT_SUBJECT_REGISTRATION_RESOURCE, SUBJECT_RESOURCE, SOMETHING_WENT_WRONG } from "~/api/shared/helpers/messages/SystemMessages";

@autoInjectable()
export default class StudentSubjectRegistrationCreateService extends BaseService<IRequest> {
  static serviceName = "StudentSubjectRegistrationCreateService";
  loggingProvider: ILoggingDriver;
  private subjectReadProvider: SubjectReadProvider;
  private studentSubjectRegistrationDeleteProvider: StudentSubjectRegistrationDeleteProvider;
  private studentSubjectRegistrationCreateProvider: StudentSubjectRegistrationCreateProvider;

  constructor(studentSubjectRegistrationCreateProvider: StudentSubjectRegistrationCreateProvider, studentSubjectRegistrationDeleteProvider: StudentSubjectRegistrationDeleteProvider, subjectReadProvider: SubjectReadProvider) {
    super(StudentSubjectRegistrationCreateService.serviceName);
    this.subjectReadProvider = subjectReadProvider;
    this.loggingProvider = LoggingProviderFactory.build();
    this.studentSubjectRegistrationCreateProvider = studentSubjectRegistrationCreateProvider;
    this.studentSubjectRegistrationDeleteProvider = studentSubjectRegistrationDeleteProvider;
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId, subjectIds } = args.body;

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
        await this.studentSubjectRegistrationDeleteProvider.deleteMany(
          {
            studentId: args.studentId,
            calendarId: args.calendarId,
            tenantId: args.tenantId,
          },
          tx
        );

        const created = [];

        for (const subjectId of args.subjectIds) {
          const registration = await this.studentSubjectRegistrationCreateProvider.createOrUpdate(
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
