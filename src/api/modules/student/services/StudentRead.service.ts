import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SUCCESS, NOT_FOUND, READ, STUDENT_RESOURCE } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";

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

      const students = await this.studentReadCache.getByCriteria(args.body);

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
