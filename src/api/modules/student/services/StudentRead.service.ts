import { autoInjectable } from "tsyringe";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { SUCCESS, STUDENT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";

@autoInjectable()
export default class StudentReadService extends BaseService<IRequest> {
  static serviceName = "StudentReadService";
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;

  constructor(studentReadCache: StudentReadCache) {
    super(StudentReadService.serviceName);
    this.studentReadCache = studentReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.params);

      const singleStudent = await this.studentReadCache.getOneByCriteria({ ...args.body, ...args.params });

      if (!singleStudent) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(STUDENT_RESOURCE), HttpStatusCodeEnum.NOT_FOUND);
      }

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_RESOURCE), singleStudent);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async studentRead(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.body);

      const { tenantId } = args.body;
      const { classId, classDivisionId, excludePromotedInCalendarId } = args.query;

      const students = await this.studentReadCache.getByCriteria({ tenantId, classId: Number(classId), classDivisionId: Number(classDivisionId), excludePromotedInCalendarId: Number(excludePromotedInCalendarId) });

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(STUDENT_RESOURCE), students);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
