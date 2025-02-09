import { BaseService } from "../../base/services/Base.service";
import { IResult } from "~/api/shared/helpers/results/IResult";
import { SUCCESS, NOT_FOUND, READ } from "~/api/shared/helpers/messages/SystemMessages";
import { autoInjectable } from "tsyringe";
import { HttpStatusCodeEnum } from "~/api/shared/helpers/enums/HttpStatusCode.enum";
import { ServiceTrace } from "~/api/shared/helpers/trace/ServiceTrace";
import { ILoggingDriver } from "~/infrastructure/internal/logger/ILoggingDriver";
import { LoggingProviderFactory } from "~/infrastructure/internal/logger/LoggingProviderFactory";
import { ERROR } from "~/api/shared/helpers/messages/SystemMessages";
import { BadRequestError } from "~/infrastructure/internal/exceptions/BadRequestError";
import StudentReadProvider from "../providers/StudentRead.provider";
import { RESOURCE_FETCHED_SUCCESSFULLY, RESOURCE_RECORD_NOT_FOUND } from "~/api/shared/helpers/messages/SystemMessagesFunction";
import StudentReadCache from "../cache/StudentRead.cache";
import { IRequest } from "~/infrastructure/internal/types";
import UserReadCache from "../../user/cache/UserRead.cache";

@autoInjectable()
export default class StudentReadService extends BaseService<IRequest> {
  static serviceName = "StudentReadService";
  studentReadProvider: StudentReadProvider;
  userReadCache: UserReadCache;
  loggingProvider: ILoggingDriver;
  studentReadCache: StudentReadCache;

  constructor(studentReadProvider: StudentReadProvider, userReadCache: UserReadCache, studentReadCache: StudentReadCache) {
    super(StudentReadService.serviceName);
    this.studentReadProvider = studentReadProvider;
    this.userReadCache = userReadCache;
    this.studentReadCache = studentReadCache;
    this.loggingProvider = LoggingProviderFactory.build();
  }

  public async execute(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.params);

      const studentUser = await this.studentReadCache.getOneByCriteria(args.body);

      if (!studentUser) {
        throw new BadRequestError(RESOURCE_RECORD_NOT_FOUND(NOT_FOUND), HttpStatusCodeEnum.NOT_FOUND);
      }

      trace.setSuccessful();

      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(READ), studentUser);

      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }

  public async studentRead(trace: ServiceTrace, args: IRequest): Promise<IResult> {
    try {
      this.initializeServiceTrace(trace, args.params);

      const students = await this.studentReadCache.getByCriteria(args.body);

      trace.setSuccessful();
      this.result.setData(SUCCESS, HttpStatusCodeEnum.SUCCESS, RESOURCE_FETCHED_SUCCESSFULLY(READ), students);
      return this.result;
    } catch (error: any) {
      this.loggingProvider.error(error);
      this.result.setError(ERROR, error.httpStatusCode, error.description);
      return this.result;
    }
  }
}
